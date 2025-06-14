# VideoBrowser Technical Overview

This document describes the current implementation of the VideoBrowser application.

## Technology Stack
- **JavaScript & HTML/CSS**: The UI is written with vanilla JavaScript modules and plain CSS.
- **Local Storage**: Video data is cached in IndexedDB while user preferences and history are stored in `localStorage`.
- **Testing**: End-to-end tests are written with Playwright and Cucumber.

## Data Loading
- `index.html` contains a file input used to select the JSON file.
- `js/dataLoader.js` parses the file and performs basic validation.
- Parsed videos are stored in the global `allVideos` array and persisted to IndexedDB via `js/utils/dbUtils.js`.

## Main Application Logic
- `js/app.js` wires up event listeners, loads cached data on startup and orchestrates rendering.
- Pagination is handled inside `app.js` with helper functions for sorting and filtering from `js/utils/videoUtils.js`.
- User feedback is recorded by `js/learning/difficultyManager.js` which updates the `targetDifficulty` value.

## UI Components
- `js/ui/videoCard.js` creates the DOM structure for each video including:
  - Title, guides and metadata
  - A **Watch on YouTube** button
  - Feedback buttons (**Too Easy**, **Right Level**, **Too Hard**)
  - Expandable section showing description, tags and guides
  - Badge for watched videos and display of latest feedback

## Features
- Text search and dropdown filters for level, sound quality and guide
- Sorting by difficulty, publication date, duration or title
- View history popup listing watched videos with timestamps
- Export and import of application state as JSON
- Keyboard shortcut to focus the search bar (`/`)

## Storage Details
- **IndexedDB** (`VideoBrowserDB` / `videos` store) caches the loaded videos.
- **localStorage** keeps:
  - `targetDifficulty` and feedback history
  - `watchedHistory` and `watchedDates`
  - Last viewed page

## File Structure Overview
```
.
├── index.html
├── css/style.css
├── js/
│   ├── app.js
│   ├── dataLoader.js
│   ├── learning/
│   │   └── difficultyManager.js
│   ├── ui/
│   │   └── videoCard.js
│   └── utils/
│       ├── dbUtils.js
│       ├── videoUtils.js
│       └── youtubeUtils.js
└── docs/
    └── technical-implementation.md (this file)
```
