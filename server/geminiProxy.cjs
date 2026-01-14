const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent';
const API_KEY = process.env.GEMINI_API_KEY;

app.post('/api/gemini', async (req, res) => {
  console.log('Received request to /api/gemini:', req.body);
  try {
    let { prompt } = req.body;
    // Always use a detection prompt for AI-generated text
    const detectionPrompt = `Analyze the following text and estimate the likelihood that it was written by an AI system.\nReturn only a JSON object with the following fields:\n- likelihood_score: a number from 0 (very likely human) to 100 (very likely AI-generated)\n- highlights: an array of objects, each with:\n    - start: the start index of the suspicious text span\n    - end: the end index of the suspicious text span\n    - text: the exact text span\n    - reason: a short explanation of why this segment is suspicious\n- observations: an array of short, clear strings explaining what features or patterns led to your score (e.g., repetition, unnatural phrasing, lack of personal experience, etc.)\nText: ${prompt}\n\nReturn only a JSON object, with no extra text or formatting.`;

    const response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`, {
      contents: [{ parts: [{ text: detectionPrompt }] }]
    });
    console.log('Gemini API response:', response.data);
    let jsonString = '';
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      jsonString = response.data.candidates[0].content.parts[0].text;
    }
    console.log('Gemini raw response text:', jsonString);
    // Remove markdown code block if present
    jsonString = jsonString.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json[\r\n]+/, '').replace(/```\s*$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```[\w]*[\r\n]+/, '').replace(/```\s*$/, '');
    }
    const match = RegExp(/\{[\s\S]*\}/).exec(jsonString);
    if (!match) {
      console.error('Failed to extract JSON. Raw Gemini response:', jsonString);
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
