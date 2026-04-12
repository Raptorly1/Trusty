const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const openRouterApiUrl = 'https://openrouter.ai/api/v1/chat/completions';
const openRouterProxyUrl = process.env.OPENROUTER_PROXY_URL || 'https://trusty-ldqx.onrender.com/api/openrouter';
const openRouterReferer = process.env.OPENROUTER_REFERER || 'https://trusty-rho.vercel.app';
const openRouterTitle = process.env.OPENROUTER_TITLE || 'Trusty';

// CORS configuration to allow requests from Vercel frontend
const corsOptions = {
  origin: [
    'https://trusty-rho.vercel.app',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
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

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const healthState = {
  lastCheck: 0,
  status: 'healthy'
};

app.get('/health', (req, res) => {
  healthState.lastCheck = Date.now();
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

const forwardToOpenRouter = async (req, res) => {
  try {
    const requestBody = req.body || {};
    const payload = requestBody.payload ?? requestBody.params ?? requestBody;

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        error: 'Missing request payload',
        message: 'Expected a payload object containing the OpenRouter request body'
      });
    }

    const openRouterBody = {
      ...payload,
      stream: false
    };

    if (!openRouterApiKey) {
      const proxyResponse = await fetch(openRouterProxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const proxyRawText = await proxyResponse.text();
      let proxyResponseData;

      try {
        proxyResponseData = JSON.parse(proxyRawText);
      } catch {
        proxyResponseData = { text: proxyRawText };
      }

      if (!proxyResponse.ok) {
        const proxyMessage = proxyResponseData?.error?.message || proxyResponseData?.message || proxyRawText || `OpenRouter proxy request failed with status ${proxyResponse.status}`;
        return res.status(proxyResponse.status).json({
          error: 'OpenRouter proxy request failed',
          message: proxyMessage
        });
      }

      return res.status(200).json(proxyResponseData);
    }

    const response = await fetch(openRouterApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': openRouterReferer,
        'X-Title': openRouterTitle
      },
      body: JSON.stringify(openRouterBody)
    });

    const rawText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(rawText);
    } catch {
      responseData = { text: rawText };
    }

    if (!response.ok) {
      const message = responseData?.error?.message || responseData?.message || rawText || `OpenRouter request failed with status ${response.status}`;
      return res.status(response.status).json({
        error: 'OpenRouter request failed',
        message
      });
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);

    const message = error && typeof error === 'object' && 'message' in error ? error.message : 'An unexpected error occurred';

    if (message.includes('API key')) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'The provided OpenRouter API key is invalid or missing'
      });
    }

    if (message.includes('rate limit') || message.includes('quota')) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'OpenRouter rate limits or quota have been exceeded'
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message
    });
  }
};

app.post('/api/openrouter', forwardToOpenRouter);
app.post('/api/gemini', forwardToOpenRouter);

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} was not found`
  });
});

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
  console.log(` OpenRouter API proxy at: http://localhost:${port}/api/openrouter`);
  console.log(` CORS enabled for: ${corsOptions.origin.join(', ')}`);
});
