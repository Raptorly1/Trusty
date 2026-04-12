import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const localApiRelay = () => ({
  name: 'local-api-relay',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      const requestUrl = req.url || '';

      if (!requestUrl.startsWith('/api/') && requestUrl !== '/health') {
        return next();
      }

      const targetUrl = `http://127.0.0.1:10000${requestUrl}`;
      const headers: Record<string, string> = {};

      for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === 'string' && key !== 'host' && key !== 'content-length') {
          headers[key] = value;
        }
      }

      const chunks: Buffer[] = [];

      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }

      const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;

      try {
        const response = await fetch(targetUrl, {
          method: req.method || 'GET',
          headers,
          body
        });

        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
          if (key.toLowerCase() !== 'transfer-encoding') {
            res.setHeader(key, value);
          }
        });

        const responseBody = Buffer.from(await response.arrayBuffer());
        res.end(responseBody);
      } catch (error) {
        next(error);
      }
    });
  }
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react(), localApiRelay()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
