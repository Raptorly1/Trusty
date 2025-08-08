const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// CORS configuration to allow requests from Vercel frontend
const corsOptions = {
  origin: [
    'https://trusty-rho.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    /\.vercel\.app$/
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Google Generative AI
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (error) {
  console.error('Failed to initialize Google Generative AI:', error.message);
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Main Gemini API proxy endpoint
app.post('/api/gemini', async (req, res) => {
  try {
    const { endpoint, params } = req.body;

    if (!endpoint || !params) {
      return res.status(400).json({ 
        error: 'Missing endpoint or params in request body' 
      });
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: params.model });

    let result;

    switch (endpoint) {
      case 'generateContent':
        if (params.config && params.config.tools) {
          // Handle requests with tools (like Google Search)
          result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: params.contents }] }],
            tools: params.config.tools
          });
        } else if (params.contents && typeof params.contents === 'object' && params.contents.parts) {
          // Handle multipart content (like image + text)
          const generationConfig = params.config ? {
            temperature: params.config.temperature,
            maxOutputTokens: params.config.maxOutputTokens,
            responseMimeType: params.config.responseMimeType,
            responseSchema: params.config.responseSchema
          } : {};

          result = await model.generateContent({
            contents: [{ role: 'user', parts: params.contents.parts }],
            generationConfig
          });
        } else {
          // Handle simple text content
          const generationConfig = params.config ? {
            temperature: params.config.temperature,
            maxOutputTokens: params.config.maxOutputTokens,
            responseMimeType: params.config.responseMimeType,
            responseSchema: params.config.responseSchema
          } : {};

          result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: params.contents }] }],
            generationConfig
          });
        }
        break;

      default:
        return res.status(400).json({ 
          error: `Unsupported endpoint: ${endpoint}` 
        });
    }

    // Extract the response text and other relevant data
    const response = result.response;
    const text = response.text();
    
    // Include grounding metadata if available (for fact-checking with search)
    const responseData = {
      text,
      candidates: result.response.candidates
    };

    res.json(responseData);

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Handle different types of errors
    if (error.message?.includes('API key')) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        message: 'The provided API key is invalid or missing'
      });
    }
    
    if (error.message?.includes('quota')) {
      return res.status(429).json({ 
        error: 'Quota exceeded',
        message: 'API quota has been exceeded'
      });
    }

    if (error.message?.includes('safety')) {
      return res.status(400).json({ 
        error: 'Content blocked by safety filters',
        message: 'The content was blocked by safety filters'
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Handle 404 for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} was not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

app.listen(port, () => {
  console.log(` Trusty proxy server running on port ${port}`);
  console.log(` Health check available at: http://localhost:${port}/health`);
  console.log(` Gemini API proxy at: http://localhost:${port}/api/gemini`);
  console.log(` CORS enabled for: ${corsOptions.origin.join(', ')}`);
});
