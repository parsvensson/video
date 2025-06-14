# Deprecated: This file describes the initial MVP and is kept for reference only

# videobrowser: Technical Documentation - Phase 1 MVP

This document provides a technical description of the implemented Phase 1 MVP of videobrowser, a desktop browser application for navigating and launching YouTube videos from a local JSON metadata file.

## Technology Stack

- **Frontend Framework**: Vanilla JavaScript
- **State Management**: Native JavaScript patterns (global variables and event listeners in `app.js`)
- **Styling**: Plain CSS (`css/style.css`)
- **Data Persistence**: IndexedDB (via `js/utils/dbUtils.js`) and LocalStorage (for watch history and timestamps via `js/utils/youtubeUtils.js`)
- **Build Tool**: None (direct use of ES modules)
- **Testing**: Not implemented in Phase 1

## Detailed Implementation

### 1. File Selection & Data Loading

#### Components & Logic
- **File Input**: An `<input type="file">` element (`#fileInput` in `index.html`) handled by `js/app.js`.
- **Data Loading & Validation**: `js/dataLoader.js` (`loadVideoData` function) processes the selected JSON file. Basic structure validation is performed by `validateBasicStructure` within the same file.
- **Error Handling**: Basic error handling is done via `try...catch` blocks in `js/dataLoader.js` and `js/app.js`, with messages logged to the console.

#### Technical Approach
The `loadVideoData` function in `js/dataLoader.js` handles the entire process of reading a file, parsing its JSON content, and validating the structure. It implements proper error handling with detailed error messages that are logged to the console and propagated to the caller.

The `validateBasicStructure` function performs several key checks:
- Verifies the data is an array
- Checks that the first item contains required properties (`_id`, `title`, `duration`, etc.)
- Ensures video identifier properties are present (either `sources.youtube` or `hostingId`)

These validations are critical to ensure the application can correctly interpret and display the video data.

#### Schema
The application expects an array of video objects with the following key properties:

- **Identification**: `_id` (primary key), `hostingId` (alternative identifier)
- **Basic Info**: `title`, `description`, `level` (e.g., "beginner")
- **Media Properties**: `duration` (in seconds), `sources.youtube` (YouTube ID)
- **Categorization**: `tags`, `guides`, `difficultyScore` (numeric value)
- **Timestamps**: `publishedAt` (used for sorting)

Additional properties like `private`, `endCutout`, `soundQuality`, `seriesId`, `hasAccess`, and others are included in the schema but not all are actively used in Phase 1.

#### Data Storage
- **In-memory**: Loaded video data is stored in the `allVideos` array in `js/app.js`.
- **IndexedDB**: `js/utils/dbUtils.js` handles saving the loaded video data to IndexedDB (`VideoBrowserDB`, `videos` store) to persist it across sessions. Data is loaded from IndexedDB on application initialization if available.

### 2. Basic Video Listing

#### Components & Logic
- **Video List Container**: A `div` with `id="videoList"` in `index.html` displays the video cards.
- **Video Card**: `js/ui/videoCard.js` (`createVideoCard` function) generates the HTML structure for each video item.
- **Pagination**: Implemented in `js/app.js` with controls in `index.html` (`#prevPage`, `#nextPage`, `#muchEasierPage`, `#muchHarderPage`, `#pageInfo`). Pagination is based on a fixed number of `videosPerPage` (15).

#### Technical Approach
The `createVideoCard` function in `js/ui/videoCard.js` dynamically generates DOM elements for each video card. The structure includes:

1. A container div with the video's ID in its dataset
2. A title element (h3)
3. A guides paragraph listing associated guides
4. A metadata section containing:
   - Duration (formatted as MM:SS)
   - Difficulty score
   - Level information
5. A "Watch on YouTube" button with click handler

The video list is managed in `js/app.js`, which handles the current subset of videos to display and renders them into the DOM using the `createVideoCard` function.

Virtual scrolling is not implemented in Phase 1; instead, standard pagination controls navigate through the video collection.

#### Sorting Logic
- **Initial Sort & Target Difficulty**: On data load, `js/app.js` calculates an initial `targetDifficulty` (median of all `difficultyScore`s). The initial view attempts to show videos around this difficulty.
- **Available Sort Options**: Users can sort by "Difficulty" (default, proximity to `targetDifficulty`), "Newest" (`publishedAt`), "Duration", and "Title". Sorting logic is primarily handled in `js/app.js` (`applyCurrentFiltersAndSort`) using helper functions from `js/utils/videoUtils.js`.
- **Pagination Buttons**: "Much Easier/Harder" buttons jump 5 pages. "Easier/Harder" buttons navigate one page.

The difficulty-based sorting is particularly important as it allows users to find videos matching their current skill level, with the initial view centered around the median difficulty of all videos.

### 3. Simple Search & Filtering

#### Components & Logic
- **Search Bar**: An `<input type="search">` (`#searchBar` in `index.html`) allows text-based search.
- **Filter Controls**: `<select>` elements in `index.html` for filtering:
    - `#levelFilter` (by `level`)
    - `#soundQualityFilter` (by `soundQuality`)
- **Sort Controls**: A `<select>` element (`#sortOptions` in `index.html`) for changing the sort order.
- **Event Handling**: All search, filter, and sort inputs are handled by `js/app.js` (`handleSearchAndFilter`, `handleSortChange`).

#### Technical Approach
The search functionality (`searchVideos` in `js/utils/videoUtils.js`) performs case-insensitive string matching across multiple video properties:
- Title text
- Tags array (matching any tag)
- Guides array (matching any guide)

The filtering system (`applyFilters` in `js/utils/videoUtils.js`) implements simple equality filtering for:
- Level (e.g., "beginner", "intermediate")
- Sound quality (e.g., "podcast-friendly")

These operations are combined in `applyCurrentFiltersAndSort` in `js/app.js`, which applies both search and filter criteria to produce the `currentVideos` array, which is then paginated for display.

For Phase 1, no debouncing is implemented for the search, as performance is adequate for the expected dataset size (~5600 videos).

### 4. Video Launching

#### Components & Logic
- Functionality is integrated into the `videoCard.js` "Watch on YouTube" button.
- `js/utils/youtubeUtils.js` provides utility functions for opening YouTube videos and tracking watched status.

#### Technical Approach
When a user clicks the "Watch on YouTube" button on a video card, the following sequence occurs:

1. The button's event handler calls `handleWatchVideo` in `app.js`
2. This function calls `openYouTubeVideo` from `youtubeUtils.js`, passing the YouTube ID
3. `openYouTubeVideo` constructs a YouTube URL and opens it in a new browser tab
4. `trackWatchedVideo` from `app.js` records the video ID and timestamp in LocalStorage

This implementation maintains a watch history that persists across sessions, allowing the application to potentially highlight watched videos or implement features like "continue watching" in future versions.

### 5. User Interface

#### Structure & Styling
- **Main HTML**: `index.html` defines the overall page structure including header, controls, video list area, pagination, and footer.
- **Main Application Logic**: `js/app.js` initializes event listeners and manages the application flow.
- **Styling**: `css/style.css` provides all styling for the application. It uses CSS variables for theming and Flexbox/Grid for layout.
- **Responsiveness**: Basic responsive behavior is implemented through CSS.

The styling approach uses CSS variables for consistent theming throughout the application, with key variables for colors, shadows, and spacing. The video list uses CSS Grid with auto-fill behavior to create a responsive layout that adapts to different screen sizes without explicit media queries.

Key UI components include:
- A fixed header with app title and controls
- Search and filter inputs grouped in a control panel
- A grid layout for the video cards
- Pagination controls at the bottom
- Minimal footer with version information

## Performance Considerations (Phase 1)

1.  **Efficient Data Handling**:
    -   Data is loaded once and kept in memory (`allVideos`).
    -   Pagination is used to display a limited number of video cards (15 per page) in the DOM at any time.
    -   DOM manipulations are primarily done when rendering a new page of videos.
2.  **Search & Filter Optimizations**:
    -   Search and filtering operations are performed on the in-memory `allVideos` array.
    -   For the current dataset size (expected up to ~5600 videos), these operations are generally performant enough without explicit debouncing or complex indexing in Phase 1.
3.  **Memory Management**:
    -   The main memory consideration is the `allVideos` array.
    -   No explicit DOM recycling beyond standard browser behavior for elements that are removed/re-added during pagination.

## Storage Strategy

1.  **Application State (In-Memory in `js/app.js`)**:
    -   `allVideos`: Array of all loaded video objects.
    -   `currentVideos`: Array of videos after filtering and sorting, before pagination.
    -   `currentPage`: Current page number for pagination.
    -   `videosPerPage`: Constant, 15.
    -   `targetDifficulty`: Calculated median difficulty, used for default sorting.
2.  **LocalStorage (`js/utils/youtubeUtils.js`)**:
    -   `watchedHistory`: Array of video IDs that have been watched.
    -   `watchedDates`: Object mapping video IDs to ISO timestamp strings of the last watch.
3.  **IndexedDB (`js/utils/dbUtils.js`)**:
    -   `VideoBrowserDB` / `videos` store: Persists the entire array of video objects using `_id` as the keyPath. This allows the application to remember the last loaded JSON data across sessions.

## Code Organization

```
.
├── combined_videos_json_schema.json (Schema definition, not directly used by app at runtime)
├── combined_videos.json (Example data file)
├── index.html (Main application page)
├── README.md
├── css/
│   └── style.css (All application styles)
├── docs/
│   ├── product-description.md
│   └── technical-implementation-phase1.md (This document)
├── js/
│   ├── app.js (Main application logic, event handling, state management)
│   ├── dataLoader.js (File loading, JSON parsing, basic validation)
│   ├── ui/
│   │   └── videoCard.js (Creates video card DOM elements)
│   └── utils/
│       ├── dbUtils.js (IndexedDB interaction logic)
│       ├── videoUtils.js (Sorting, searching, filtering helper functions)
│       └── youtubeUtils.js (YouTube video launching and watch tracking)
```

This document describes the technical implementation of videobrowser as of the completion of Phase 1 MVP.
