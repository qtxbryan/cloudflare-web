import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 10000,
  retries: 1,
  webServer: {
    command: 'npm run dev -- --host 0.0.0.0 --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
});
