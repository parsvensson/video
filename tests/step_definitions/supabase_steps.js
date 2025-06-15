import { createBdd } from 'playwright-bdd';
const { Given } = createBdd();
import { getBaseUrl } from '../../js/utils/testBaseUrl';

Given('the user is on the application\'s main page with Supabase configured', async ({ page }) => {
  await page.goto(getBaseUrl());
});

