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

The project uses plain HTML and JavaScript and requires no build step.

### Prerequisites

* A modern web browser that supports ES6 Modules
* A local JSON file conforming to `combined_videos_json_schema.json`

### Running the Application

1. Open a local HTTP server in the project folder (e.g. `python -m http.server`)
2. Navigate to the served URL in your browser.
3. Click **Choose File** and select your JSON data file.
4. Browse and launch videos.

### Supabase Configuration

VideoBrowser can also read video metadata from a hosted Supabase project. Set
`window.SUPABASE_URL` to `https://dzxzmneyogcypfaqusgi.supabase.co` and
`window.SUPABASE_ANON_KEY` to
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6eHptbmV5b2djeXBmYXF1c2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTUxMTQsImV4cCI6MjA2NTQ5MTExNH0.M59Fd-oBAGNDconMvhfZy7tWtk8XIi71us2DUI73Sek`
before loading `index.html`.

## Running Tests

Execute all Playwright tests with:

```bash
npm run test:e2e
```

The generated HTML report can be opened with `npm run report:e2e`.

