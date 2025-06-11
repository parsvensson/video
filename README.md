# VideoBrowser - Your Personal Video Navigator

VideoBrowser is a desktop application designed to help users easily browse, find, and launch YouTube videos from their extensive local JSON metadata file. The primary goal is to make a large personal video library more accessible and useful.

## Features (MVP)

*   **Load Local JSON:** Select and load a local JSON file containing video metadata.
*   **Video Listing:** Display videos with title, duration, difficulty score, and level.
*   **Pagination:** Navigate through the video list with previous/next buttons.
*   **Search:** Filter videos by title, tags, or guides.
*   **Filter:** Filter videos by difficulty level and sound quality.
*   **Sort:** Sort videos by difficulty (default), newest, duration, or title.
*   **Launch Video:** Open videos on YouTube in a new browser tab.
*   **Watched History:** Tracks watched videos using `localStorage` (basic implementation).
*   **Data Caching:** Caches the loaded JSON data in `localStorage` to speed up subsequent loads.

## Project Structure

```
/videobrowser
|-- index.html               # Main HTML file
|-- /css
|   |-- style.css            # Stylesheet
|-- /js
|   |-- app.js               # Main application logic, event handling, state
|   |-- dataLoader.js        # Handles loading and validating the JSON file
|   |-- /ui
|   |   |-- videoCard.js     # Creates and manages individual video card display
|   |-- /utils
|   |   |-- videoUtils.js    # Utility functions for sorting, searching, filtering videos
|   |   |-- youtubeUtils.js  # Utility functions for YouTube interaction (launching, tracking)
|-- /docs
|   |-- ... (project documentation)
|-- /tests                   # End-to-end tests using Playwright and Cucumber
|   |-- /features            # Gherkin feature files describing test scenarios
|   |-- /step_definitions    # JavaScript implementation of test steps
|-- combined_videos.json (example data file - not included in repo, user provides their own)
|-- combined_videos_json_schema.json # Schema for the video data
|-- playwright-report/       # HTML report output from Playwright tests
|-- generate-report.js       # (legacy) script to generate HTML Cucumber reports
|-- README.md                # This file
```

## How to Build and Run

This project is built with vanilla JavaScript, HTML, and CSS, and does not require a complex build process for the MVP.

### Prerequisites

*   A modern web browser that supports ES6 Modules (e.g., Chrome, Firefox, Edge, Safari).
*   A local JSON file containing your video metadata, conforming to the structure described in `combined_videos_json_schema.json`.

### Running the Application

1.  **Clone or Download the Repository (if applicable)**
    If you have this project in a Git repository, clone it. Otherwise, ensure all the files (`index.html`, `css/`, `js/`) are in a local directory.

2.  **Prepare Your Data File**
    Place your `combined_videos.json` (or similarly named JSON file) in a location accessible by your browser (e.g., in the project root, or your Documents folder).

3.  **Open `index.html` in Your Browser**
    *   Navigate to the project directory in your file explorer.
    *   Double-click `index.html` or right-click and choose "Open with" your preferred web browser.
    *   **Alternatively (and often better for local development with JavaScript modules):** Serve the directory using a simple local HTTP server.
        *   If you have Python installed, open a terminal in the project root directory and run:
            ```bash
            python -m http.server
            ```
            Then open your browser and go to `http://localhost:8000` (or the port shown in the terminal).
        *   If you have Node.js and `npx` installed, you can use `serve`:
            ```bash
            npx serve
            ```
            Then open the URL shown in the terminal (usually `http://localhost:3000` or `http://localhost:5000`).
        *   Many code editors (like VS Code with the "Live Server" extension) also provide an easy way to serve local HTML files.

4.  **Load Your Data**
    *   Once the page is loaded, you will see a "Choose File" button (or similar, depending on your browser).
    *   Click this button and select your local JSON video data file.
    *   The videos should then load and display on the page.

## GitHub Pages Deployment

This project is configured with GitHub Actions for testing and deployment.
Every push triggers the **Playwright Tests** workflow defined in
`.github/workflows/playwright.yml`. When those tests finish successfully, the
**Deploy to video Pages** workflow (`.github/workflows/pages.yml`) runs and
publishes the latest build to the separate repository
[`parsvensson/video`](https://github.com/parsvensson/video).

To enable Pages on your own fork:

1. Create a repository secret called `VIDEO_DEPLOY_TOKEN` with a token
   that has push access to `parsvensson/video`.
2. Enable GitHub Pages on that repository from the `gh-pages` branch.


Once enabled, every push from any branch will update the live site at the URL
displayed in the workflow logs.


## Running Tests

You can run all Playwright BDD tests with:

```bash
npm run test:e2e
```

This command serves the application, compiles the feature files using `bddgen`, and then executes `playwright test`.

### Testing Framework

#### Technology Stack

- **Playwright**: Browser automation framework used for controlling headless browsers.
- **Cucumber.js**: BDD (Behavior-Driven Development) framework used for writing tests in Gherkin.
- **playwright-bdd**: Integrates Playwright with Cucumber.js, allowing Gherkin feature files to drive Playwright tests.
- **Gherkin**: Business-readable domain-specific language for writing test scenarios.
- **HTML Reporter**: Test results are generated in HTML format (viewable via `playwright show-report` or custom scripts like `generate-report.js`).

### Test Structure

Tests in this project follow a BDD approach with the following structure:

- **Features**:
  - Located in `tests/features/*.feature`
  - Written in Gherkin syntax with scenarios describing application behavior
  - Example features include `file_upload.feature`, `footer.feature`, `view_history.feature`

- **Step Definitions**:
  - Located in `tests/step_definitions/*.js`
  - JavaScript files that implement the steps defined in feature files
  - Connect Gherkin steps to actual test automation code

### Writing Tests

To add new tests to the project:

1. **Create a Feature File**:
   - Add a new `.feature` file in the `tests/features` directory
   - Use Gherkin syntax to define scenarios:
     ```gherkin
     Feature: Feature name
       
       Scenario: Specific scenario to test
         Given some initial context
         When an action occurs
         Then verify the outcome
     ```

2. **Implement Step Definitions**:
   - Create or update a file in `tests/step_definitions` directory.
   - Import step helpers from `playwright-bdd` and implement each step:
     ```javascript
     import { createBdd } from 'playwright-bdd';
     const { Given, When, Then } = createBdd();
     const assert = require('assert');

     Given('some initial context', async ({ page }) => {
       // Interact with the application using Playwright
     });

     When('an action occurs', async ({ page }) => {
       // Perform user actions
     });

     Then('verify the outcome', async ({ page }) => {
       // Validate results with assertions
     });
     ```
   - Each step receives the Playwright `page` object via the function parameter `{ page }`.

3. **Run Tests**:
   - Execute `npm run test:e2e` to serve the app and run your tests. The generated HTML report can be found in `playwright-report/index.html`.

4. **Generate Reports**:
   - Run `npm run report:e2e` to open the last Playwright HTML report.

### Best Practices

- Keep feature files focused on business requirements, not implementation details
- Reuse step definitions across different feature files when possible
- Use appropriate timeouts for operations that might take longer to complete
- Add helpful assertions with descriptive error messages

## Development

*   **Code Structure:** The JavaScript is organized into modules within the `js` directory.
    *   `app.js`: Main application orchestration.
    *   `dataLoader.js`: Handles file input and JSON parsing/validation.
    *   `js/ui/videoCard.js`: Manages the creation and display of individual video cards.
    *   `js/utils/`: Contains helper functions for video manipulation and YouTube interaction.
*   **Styling:** CSS is located in `css/style.css`.
*   **No Build Step (for MVP):** The MVP uses native ES6 modules, so no transpilation or bundling is strictly necessary for modern browsers if served correctly (see "Running the Application" point 3).


