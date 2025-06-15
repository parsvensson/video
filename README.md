# VideoBrowser - Your Personal Video Navigator

VideoBrowser is a desktop web application for browsing and launching YouTube videos from a local JSON metadata file. It helps you sift through large personal video collections entirely offline.

## Current Features

* **Load Local JSON**: Select and load a video metadata file.
* **Video Listing**: Paginated grid with title, duration, difficulty score and level.
* **Clickable Tags and Guides**: Tags and guide names can be clicked to filter the list.
* **Search and Filters**: Text search plus dropdowns for level, sound quality and guide.
* **Sorting**: Sort by difficulty (default), publication date, duration or title.
* **Watch on YouTube**: Open the selected video in a new browser tab.
* **Difficulty Feedback**: Rate videos as "Too Easy", "Right Level" or "Too Hard" to adjust your target difficulty.
* **Watched History**: Viewed videos are tracked and can be reviewed in a history dialog.
* **State Export/Import**: Save or restore cached video data and preferences as a JSON file.
* **Data Caching**: Loaded JSON data is stored in IndexedDB for faster subsequent launches.

## Project Structure

``` 
/videobrowser
|-- index.html               # Main HTML file
|-- /css
|   `-- style.css            # Stylesheet
|-- /js
|   |-- app.js               # Main application logic
|   |-- dataLoader.js        # Handles loading and validating the JSON file
|   |-- /learning
|   |   `-- difficultyManager.js
|   |-- /ui
|   |   `-- videoCard.js     # Video card component
|   `-- /utils
|       |-- dbUtils.js       # IndexedDB and export/import helpers
|       |-- videoUtils.js    # Sorting, searching, filtering helpers
|       `-- youtubeUtils.js  # YouTube launching and watch tracking
|-- /docs
|   `-- ... (project documentation)
|-- /tests                   # End-to-end tests using Playwright and Cucumber
|   |-- /features            # Gherkin feature files
|   `-- /step_definitions    # Step implementations
|-- combined_videos_json_schema.json # Schema for the video data
```

## How to Build and Run

This project now uses `esbuild` to bundle JavaScript modules.

### Prerequisites

*   A modern web browser.
*   Node.js and npm installed (to manage dependencies and run build scripts).
*   A local JSON file conforming to `combined_videos_json_schema.json` (if you want to load local data).

### Setting up and Running Locally

1.  **Install Dependencies:**
    Open your terminal in the project root and run:
    ```bash
    npm install
    ```
    This will download `esbuild` and other necessary development packages.

2.  **Build the Application:**
    To create a production-ready bundle of the JavaScript code, run:
    ```bash
    npm run build
    ```
    This command creates a `dist/bundle.js` file. After this, you can open `index.html` directly in your browser, or serve it via a simple HTTP server.

3.  **Development Workflow (with auto-rebuild):**
    For easier development, you can use a watch command that automatically rebuilds the bundle whenever you change a JavaScript file.
    In your terminal, run:
    ```bash
    npm run watch
    ```
    Then, open `index.html` in your browser (e.g., by using a live server extension in your IDE, or a simple command like `npx serve .`). The page will use the Supabase client to fetch data if not using a local file.
    Note: For local development using Supabase, ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set on the `window` object in `index.html`.

4.  **Loading Local Data:**
    Once the application is running in your browser (either after `npm run build` or using `npm run watch`), click the "Choose File" button (or equivalent UI element if it has changed) to select your JSON data file.

## Running Tests

Execute all Playwright tests with:

```bash
npm run test:e2e
```

The generated HTML report can be opened with `npm run report:e2e`.

