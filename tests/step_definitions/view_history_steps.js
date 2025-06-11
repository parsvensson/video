/**
 * View History Feature Test Steps
 * 
 * This file contains Cucumber step definitions for testing the View History feature.
 * 
 * Test Strategy:
 * 1. Browser setup: Reuses the browser instance from search_steps.js
 * 2. User interaction simulation: Tests user interactions with the View History dialog
 * 3. History state management:
 *    - For "has watched" scenarios: Mocks window.open to prevent opening YouTube links,
 *      then clicks watch buttons to simulate video watching history
 *    - For "has not watched" scenarios: Clears localStorage to ensure empty history
 * 4. Assertions: Checks for proper display of the dialog and its contents
 * 
 * Key techniques:
 * - localStorage manipulation to control watched video history state
 * - window.open mocking to prevent external navigation
 * - Explicit waits with timeouts to ensure UI state is stable before assertions
 */

import { createBdd } from 'playwright-bdd';
const { Given, When, Then, Step, BeforeAll, AfterAll } = createBdd();

const assert = require('assert');

const { getBaseUrl } = require('../../js/utils/testBaseUrl');

Given('the user is on the main page', async function ({ page }) {
  await page.goto(getBaseUrl());
  await page.waitForSelector('body');
  const title = await page.title();
  assert.strictEqual(title, 'VideoBrowser - Your Personal Video Navigator');
});

When('the user clicks on the "View History" button', {timeout: 10 * 1000}, async function ({ page }) {
  const viewHistoryButtonSelector = '#viewHistoryButton';

  // Wait for the button to be present and visible
  await page.waitForSelector(viewHistoryButtonSelector, { state: 'visible', timeout: 7000 });
  const viewHistoryButton = await page.locator(viewHistoryButtonSelector);

  const buttonExists = await viewHistoryButton.count();
  assert.ok(buttonExists > 0, 'The "View History" button does not exist in the DOM or is not visible.');

  await viewHistoryButton.click();
});

Then('the "View History" dialog should be displayed', {timeout: 15 * 1000}, async function ({ page }) {

  // Wait for the popup to appear in the DOM and become visible as a result of the click in the "When" step
  try {
    await page.waitForSelector('#viewHistoryPopup', { state: 'visible', timeout: 10000 });
  } catch (error) {
    const bodyHTML = await page.content();
    console.error('#viewHistoryPopup did not become visible within the timeout.', error); // Keep this error log
    throw new Error('#viewHistoryPopup did not become visible after clicking the button.');
  }

  const viewHistoryPopup = await page.locator('#viewHistoryPopup');

  // Check if the popup exists in the DOM
  const count = await viewHistoryPopup.count();
  assert.ok(count > 0, 'The "View History" popup does not exist in the DOM after waiting.');

  // Check if the popup is visible (redundant if waitForSelector with state: 'visible' succeeded, but good for explicit check)
  const isVisible = await viewHistoryPopup.isVisible();
  assert.ok(isVisible, 'The "View History" popup is not displayed after waiting.');
});

When('the user clicks on the close button of the "View History" dialog', async function ({ page }) {
  const closeButton = await page.locator('#viewHistoryPopup .close-button');
  await closeButton.click();
});

Then('the "View History" dialog should be closed', async function ({ page }) {
  const viewHistoryPopup = await page.locator('#viewHistoryPopup');
  const isVisible = await viewHistoryPopup.isVisible();
  assert.ok(!isVisible, 'The "View History" popup is still displayed.');
  const count = await viewHistoryPopup.count();
  assert.strictEqual(count, 0, 'The "View History" popup element still exists in the DOM.');
});

Given('the user has watched some videos', async function ({ page }) {
  await page.goto(getBaseUrl() + '/index.html');
  await page.waitForSelector('body'); // Ensure body is loaded

  // Mock window.open to prevent new tabs from opening and to log calls
  await page.evaluate(() => {
    window.open = (url, target, features) => {
      console.log(`Mocked window.open: URL=${url}, Target=${target}, Features=${features}`);
      // Return a mock window object that simulates a closed window or a minimal API
      return {
        closed: false,
        close: function() { this.closed = true; },
        focus: function() {},
        blur: function() {},
      };
    };
  });

  // Clear any pre-existing watched history from localStorage
  await page.evaluate(() => {
    localStorage.removeItem('watchedHistory'); // Used by app.js
    localStorage.removeItem('watchedDates');   // Used by app.js
    localStorage.removeItem('watchedVideos'); // Old format, clear just in case
  });

  // Upload a video file to populate allVideos in app.js and render video cards
  // This is necessary because trackWatchedVideo and showViewHistoryPopup rely on allVideos.
  const filePath = 'smaller_combined_videos.json'; // Assumes this file is at the root of the served directory
  
  // Wait for the file input element with a timeout
  try {
    await page.waitForSelector('#fileInput', { state: 'visible', timeout: 5000 });
    const fileInputElement = await page.locator('#fileInput');
    
    const fileInputExists = await fileInputElement.count();
    assert.ok(fileInputExists > 0, "File input #fileInput not found on the page. Cannot load videos.");
    
    await fileInputElement.setInputFiles(filePath);
  } catch (error) {
    console.error("Error while waiting for or setting input files:", error);
    throw new Error("Failed to upload test file: " + error.message);
  }

  // Wait for video cards to be rendered after file upload, indicating app.js has processed the file.
  // Specifically wait for the watch buttons within the video cards.
  try {
    await page.waitForSelector('#videoList .video-card .watch-button', { state: 'visible', timeout: 15000 });
  } catch (e) {
    console.error(`Timeout waiting for video cards with watch buttons to appear after file input of '${filePath}'. Check file path, content, and app's file processing logic.`);
    const bodyHTML = await page.content();
    console.error('Current page HTML (first 2000 chars):', bodyHTML.substring(0, 2000));
    throw e; // Re-throw the error to fail the test clearly
  }

  const watchButtons = await page.locator('#videoList .video-card .watch-button').all();
  assert.ok(watchButtons.length >= 2, `Expected at least 2 video cards with watch buttons to simulate watching, but found ${watchButtons.length}. Ensure '${filePath}' contains at least two videos.`);

  // Click the "Watch on YouTube" button for the first two videos.
  // This will trigger app.js's handleWatchVideo -> trackWatchedVideo, which updates localStorage.
  if (watchButtons.length > 0) {
    await watchButtons[0].click();
    await page.waitForFunction(() => {
      const history = JSON.parse(localStorage.getItem('watchedHistory') || '[]');
      return history.length >= 1;
    });
  }
  if (watchButtons.length > 1) {
    await watchButtons[1].click();
    await page.waitForFunction(() => {
      const history = JSON.parse(localStorage.getItem('watchedHistory') || '[]');
      return history.length >= 2;
    });
  }

  // Optional: For debugging, verify localStorage after clicks
  // const lsWatchedHistory = await page.evaluate(() => localStorage.getItem('watchedHistory'));
  // console.log('Step: "Given the user has watched some videos" - localStorage watchedHistory after clicks:', lsWatchedHistory);
  // assert.ok(lsWatchedHistory && JSON.parse(lsWatchedHistory).length >= (watchButtons.length > 1 ? 2 : 1), "localStorage 'watchedHistory' was not updated as expected after clicking watch buttons.");
});

Then('the "View History" dialog should show a list of watched videos', {timeout: 10 * 1000}, async function ({ page }) {
  await page.waitForSelector('#viewHistoryPopup .video-card', { state: 'visible', timeout: 8000 });
  const videoItems = await page.locator('#viewHistoryPopup .video-card').count();
  assert.ok(videoItems > 0, 'The View History dialog does not show any video items.');
});

Given('the user has not watched any videos', async function ({ page }) {
  await page.goto(getBaseUrl() + '/index.html');
  await page.waitForSelector('body'); // More specific selector than 'body'
  await page.evaluate(() => {
    localStorage.removeItem('watchedVideos'); // Old key, keep for good measure
    localStorage.removeItem('watchedHistory'); // New key used by app.js
    localStorage.removeItem('watchedDates');   // New key used by app.js
  });
  // It might also be necessary to ensure no videos are loaded if the app tries to populate history from allVideos
  // For now, let's assume clearing localStorage is sufficient as per the typical app logic for history.
});

Then('the "View History" dialog should show an "empty history" message', {timeout: 10 * 1000}, async function ({ page }) {
  // The popup #viewHistoryPopup is expected to be visible due to the preceding step.
  // We are looking for the text "No videos have been watched yet" within this popup.
  const emptyMessageElement = page.locator('#viewHistoryPopup').getByText('No videos have been watched yet');
  
  try {
    // Wait for the specific text to become visible within the popup.
    await emptyMessageElement.waitFor({ state: 'visible', timeout: 8000 });
  } catch (error) {
    // Provide detailed debug information if the text is not found or not visible.
    const popupExists = await page.locator('#viewHistoryPopup').count() > 0;
    let popupHTML = 'Popup #viewHistoryPopup not found.';
    if (popupExists) {
      popupHTML = await page.locator('#viewHistoryPopup').innerHTML();
    }
    console.error('Failed to find visible text "No videos have been watched yet" in #viewHistoryPopup. Details:', error.message);
    console.log('Current #viewHistoryPopup HTML (first 2000 chars):', popupHTML.substring(0, 2000));
    throw new Error(`The "empty history" message "No videos have been watched yet" was not found or not visible in #viewHistoryPopup. Check console for popup HTML. Original error: ${error.message}`);
  }
  
  // If waitFor succeeded, the element is considered visible.
  assert.ok(await emptyMessageElement.isVisible(), 'The "empty history" message "No videos have been watched yet" is present but not visible.');
});
