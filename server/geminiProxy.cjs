const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const corsOptions = {
  origin: [
    'https://trusty-rho.vercel.app', // Vercel production frontend
    'http://localhost:5173',         // Local dev
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent';
const API_KEY = process.env.GEMINI_API_KEY;

app.post('/api/gemini', async (req, res) => {
  console.log('Received request to /api/gemini:', req.body);
  try {
    let { prompt } = req.body;
    // Detect if this is a fact-check prompt
    const isFactCheck = /fact-?check|Fact-?check|Fact-check|fact-check|sources|summary/i.test(prompt);
    let geminiPrompt = prompt;
    if (!isFactCheck) {
      // Use the default detection prompt for AI-generated text
      geminiPrompt = `Analyze the following text and estimate the likelihood that it was written by an AI system.\nReturn only a JSON object with the following fields:\n- likelihood_score: a number from 0 (very likely human) to 100 (very likely AI-generated)\n- highlights: an array of objects, each with:\n    - start: the start index of the suspicious text span\n    - end: the end index of the suspicious text span\n    - text: the exact text span\n    - reason: a short explanation of why this segment is suspicious\n- observations: an array of short, clear strings explaining what features or patterns led to your score (e.g., repetition, unnatural phrasing, lack of personal experience, etc.)\nText: ${prompt}\n\nReturn only a JSON object, with no extra text or formatting.`;
    }

    const response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`, {
      contents: [{ parts: [{ text: geminiPrompt }] }]
    });
    console.log('Gemini API response:', response.data);
    let rawText = '';
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      rawText = response.data.candidates[0].content.parts[0].text;
    }
    console.log('Gemini raw response text:', rawText);
    // Remove markdown code block if present
    rawText = rawText.trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json[\r\n]+/, '').replace(/```\s*$/, '');
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```[\w]*[\r\n]+/, '').replace(/```\s*$/, '');
    }

    if (isFactCheck) {
      // Parse summary and sources from the Gemini response (reference format)
      // Try to extract ## Summary and ## Sources sections
      let summary = '';
      let sources = [];
      const summaryMatch = /## Summary\s*([\s\S]*?)(\s*## Sources|$)/.exec(rawText);
      summary = summaryMatch ? summaryMatch[1].trim() : '';
      const sourcesSectionMatch = /## Sources\s*([\s\S]*)/.exec(rawText);
      const sourcesText = sourcesSectionMatch ? sourcesSectionMatch[1].trim() : '';
      if (sourcesText) {
        // Support both markdown and JSON-like lists
        // Markdown: - [Credibility: High] Title: ... - Justification: ... (no URL)
        // JSON: [{web:{title,uri},credibility,justification}]
        if (sourcesText.startsWith('[')) {
          // Try to parse as JSON array
          try {
            const arr = JSON.parse(sourcesText);
            if (Array.isArray(arr)) {
              sources = arr.map(src => ({
                web: {
                  title: src.web?.title || 'Untitled Source',
                  uri: src.web?.uri || '',
                },
                credibility: src.credibility || 'Medium',
                justification: src.justification || '',
              }));
            }
          } catch (e) {
            // Fallback to markdown parsing below
          }
        }
        if (!Array.isArray(sources) || sources.length === 0) {
          // Markdown parsing
          const sourceLines = sourcesText.split('\n').filter(line => line.trim().startsWith('- [Credibility:'));
          const sourceRegex = /- \[Credibility: (High|Medium|Low)\] Title: (.*?)\s*-\s*Justification: (.*?)(?:\s*-\s*URL: (\S+))?$/;
          sources = sourceLines.map(line => {
            const match = sourceRegex.exec(line);
            return {
              web: {
                title: match?.[2]?.trim() || 'Untitled Source',
                uri: match?.[4] || '',
              },
              credibility: match?.[1] || 'Medium',
              justification: match?.[3]?.trim() || '',
            };
          });
        }
      }
      // Always guarantee structure
      if (!summary) summary = 'No summary available.';
      if (!Array.isArray(sources)) sources = [];
      sources = sources.map(src => ({
        web: {
          title: src.web?.title || 'Untitled Source',
          uri: src.web?.uri || '',
        },
        credibility: src.credibility || 'Medium',
        justification: src.justification || '',
      }));
      res.json({ summary, sources });
      return;
    }

    // Default: AI detection response
    const match = RegExp(/\{[\s\S]*\}/).exec(rawText);
    if (!match) {
      console.error('Failed to extract JSON. Raw Gemini response:', rawText);
      throw new Error('No JSON found in Gemini response');
    }
    const parsed = JSON.parse(match[0]);
    // Map Gemini's response to the expected AnalysisResult format, including highlights
    const likelihood_score = typeof parsed.likelihood_score === 'number' ? parsed.likelihood_score : 0;
    const observations = Array.isArray(parsed.observations) ? parsed.observations : [];
    const highlights = Array.isArray(parsed.highlights) ? parsed.highlights : [];
    res.json({ likelihood_score, observations, highlights });
  } catch (error) {
    if (error.response) {
      console.error('Gemini API error:');
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else {
      console.error('Gemini API error:', error.message);
    }
    res.status(500).json({ error: error?.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Gemini proxy server running on port ${PORT}`);
});
