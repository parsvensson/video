import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: ['tests/features/'],
  steps: 'tests/step_definitions',
});

export default defineConfig({
  testDir,
  reporter: 'html',
  use: {
    channel: 'chrome', // Use system Chrome for all tests
  },
});
