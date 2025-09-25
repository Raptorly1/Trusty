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
  try {
    const { prompt } = req.body;
    const response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    });
    res.json(response.data);
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
