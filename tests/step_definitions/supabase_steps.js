import { createBdd } from 'playwright-bdd';
const { Given } = createBdd();
const { getBaseUrl } = require('../../js/utils/testBaseUrl');

Given('the user is on the application\'s main page with Supabase configured', async ({ page }) => {
  await page.addInitScript(() => {
    window.SUPABASE_URL = 'https://dzxzmneyogcypfaqusgi.supabase.co';
    window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6eHptbmV5b2djeXBmYXF1c2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTUxMTQsImV4cCI6MjA2NTQ5MTExNH0.M59Fd-oBAGNDconMvhfZy7tWtk8XIi71us2DUI73Sek';
  });
  await page.goto(getBaseUrl());
});

