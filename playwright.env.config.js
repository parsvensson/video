// Playwright global setup to set baseURL from env or default
import { defineConfig } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:5000';

export default defineConfig({
  use: {
    baseURL,
  },
});
