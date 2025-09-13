import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // Defines environment variables for your app
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    // Sets up a path alias
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    // Configures the development server
    server: {
      // This allows any host from ngrok's free tier
      allowedHosts: ['.ngrok-free.app'],
    },
  };
});
