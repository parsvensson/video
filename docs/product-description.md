# VidDex: Your Personal Video Navigator - Updated Product Description

## 1. Overview & Core Purpose

VidDex is a desktop application designed to help users easily browse, find, and launch YouTube videos from their extensive local JSON metadata file. The primary goal is to make a large personal video library more accessible and useful by helping users discover content that matches their current learning or knowledge level.

## 2. Key User Experience & Flow

### 2.1. Effortless Start & Focused Browsing

*   Upon launch, VidDex loads the user's video data from the specified JSON file.

   It immediately presents a manageable list of videos (e.g., a configurable number, perhaps 15-30 items). This list is dynamically selected to be the closest to the user's *current target difficulty level**.

       *Initial State:** The target difficulty defaults to a sensible value (e.g., the median difficultyScore of the library or a pre-set "beginner-intermediate" zone).

       *Display:** The current target difficulty might be subtly displayed (e.g., "Focusing around difficulty: [score]").

*   The user primarily adjusts this target difficulty implicitly:

       By providing *"Too Easy"** or "Too Hard" feedback on individual videos in the list via buttons on each video card. This feedback nudges VidDex's understanding of the user's preferred level.

*   Over time, VidDex learns the user's preferred difficulty, automatically adjusting the target to show relevant content in future sessions.

### 2.2. Informative Video Display

Each video in the list prominently displays:

   *Video Title** (`title`)

   *Duration** (`duration`)

   *Difficulty Score** (`difficultyScore` - for reference and context)

   *Level** (`level` string like "intermediate" - for a quick qualitative cue)

   (Future Consideration: Thumbnail image, if easily implementable and data is available or fetchable)*

### 2.3. Refine Your Search & Broaden Discovery

   A simple *search bar** allows users to filter videos by title, tags, or guides. Search queries operate across the entire video library.

   Search results are then *prioritized/sorted** to show matches closest to the user's current target difficulty level first, though all matches remain accessible.

   *Quick filters** (e.g., dropdowns or clickable tags) for level (beginner, intermediate, etc.) and soundQuality provide further refinement on the search results or the focused list.

   Option to *sort** the displayed videos (either the focused list or search results) by:

    *   publishedAt (default: newest first)

    *   duration

    *   title

    *   difficultyScore (within the current view)

### 2.4. Instant Playback

   A clear "*Watch on YouTube**" button is available for each video.

   Clicking this button opens the corresponding YouTube video directly in a *new tab** in the user's default web browser. The URL will be constructed using sources.youtube or hostingId from the JSON data.

## 3. Personalization & Learning

   *Watched History:** VidDex will keep track of videos the user has launched.

   *Difficulty Preference Learning:**

    *   The system gradually learns the user's preferred difficultyScore based on the videos they frequently watch and the "Too Easy"/"Too Hard" feedback provided.

    *   This learned preference adjusts the default target difficulty over time, making the initial view more relevant with continued use.

## 4. Key Design Principles

   *Simplicity & Focus:** A clean, uncluttered interface that prioritizes finding and launching videos. The design will be minimalistic with a clean aesthetic to limit distractions and create a focused learning environment.

   *Adaptive Difficulty Focus:** The application intelligently centers the content around the user's evolving skill level without requiring manual range adjustments.

   *Effortless Discovery:** Quickly narrow down thousands of entries to a relevant selection, and use powerful search to explore the entire collection.

   *Personalized Experience:** The tool becomes more tailored to the user's needs over time.

   *Local First:** Operates on the local JSON file, only requiring an internet connection to launch and watch the video on YouTube.

   *Read-Only (Source Data):** Does not modify the source JSON data file. User preferences and history will be stored separately using localStorage.

## 5. Technical Context & Boundaries

### 5.1. Input Data

   *Source:** A single, local JSON file.

   *File Access:** The application will provide a file selection interface that allows users to select their JSON file from their local system. Since this is an offline-first application, the file is never "uploaded" to a server but rather read locally by the browser.

   *Structure:** The JSON file is an array of objects, where each object represents a video and conforms to the schema defined in json_schema.txt.

   *Volume:** The file contains approximately 5600 video entries.

   *Key Fields from JSON for Core Functionality:**

    *   _id: Unique identifier for the video.

    *   title: Video title (for display, search).

    *   tags: List of tags (for search/filtering).

    *   guides: List of guides/presenters (for search/filtering).

    *   publishedAt: Publication timestamp (for sorting).

    *   duration: Video duration in seconds (for display).

    *   level: Difficulty level string (e.g., "intermediate") (for display, filtering).

    *   difficultyScore: Numerical difficulty score (core for filtering, learning, sorting).

    *   soundQuality: Sound quality enum (e.g., "podcast-friendly") (for filtering).

    *   sources.youtube: YouTube video ID (for constructing playback URL).

    *   hostingId: Alternative identifier for the video on the hosting platform (can be used if sources.youtube is not ideal for URL construction).

    *   description: Video description (for display on detail view, if implemented).

### 5.2. Application Environment

   *Type:** Offline first browser application.

   *Data Processing:** All filtering, sorting, and searching of the JSON data will be done locally by the application.

   *Persistence:**

    *   The application will store user-specific data locally using localStorage, including:
        - Learned difficulty preference
        - Watched video history
        - Last used file path (if permitted by browser)

   *Internet Connectivity:** Required only to open and play videos on YouTube. The core browsing and discovery features must work offline.

### 5.3. Assumptions

*   The json_schema.txt accurately describes the structure of the input JSON file.

*   The difficultyScore field is a meaningful and relatively consistent measure across the videos.

*   The sources.youtube or hostingId field provides a valid identifier to construct a watchable YouTube URL.

## 6. Out of Scope (Initially)

*   Direct video downloading or audio downloading (though links might exist in the data, the app won't manage downloads).

*   Video editing or playback within the application itself.

*   Managing online YouTube subscriptions or interacting with YouTube APIs beyond opening a video URL.

*   Modifying the source JSON data file.

*   Complex database management beyond loading and querying the JSON, and storing simple user preferences.

*   User accounts or cloud synchronization.

*   Displaying video thumbnails unless trivially easy to implement (e.g., if a direct thumbnail URL is in the JSON and it doesn't significantly impact performance).

## 7. Implementation Plan

### Phase 1: MVP (Core Functionality)
1. **File Selection & Data Loading**
   - Interface to select and load JSON file
   - Basic validation of file structure
   - Data parsing and initial storage in application state

2. **Basic Video Listing**
   - Display of videos with essential metadata (title, duration, difficulty)
   - Initial sorting based on default target difficulty
   - Basic pagination or "load more" functionality

3. **Simple Search & Filtering**
   - Text search across title, tags, and guides
   - Basic filtering by difficulty level
   - Simple sorting options

4. **Video Launching**
   - "Watch on YouTube" functionality
   - Track watched videos in localStorage

5. **Minimal User Interface**
   - Clean, minimalistic design
   - Responsive layout for various screen sizes
   - Basic navigation and feedback elements

### Phase 2: Enhanced User Experience
1. **Difficulty Preference Learning**
   - "Too Easy", "Too Hard", and "Right Level" feedback buttons on video cards
   - Algorithm to adjust target difficulty based on user feedback
   - Persistent storage of preferences in localStorage

2. **Advanced Search & Filtering**
   - Enhanced filtering by multiple parameters
   - Combined filters and search
   - Visual indicators for search/filter status

3. **Improved Video Display**
   - More detailed video cards with expandable information
   - Better display of metadata like tags and guides
   - Visual indicators for watched videos

4. **UI Enhancements**
   - Refined animations and transitions
   - Keyboard shortcuts for power users
   - Dark/light mode toggle

### Phase 3: Advanced Features
1. **Advanced Personalization**
   - Sophisticated algorithm for difficulty adjustment
   - Personalized recommendations based on watch history
   - Custom tags or notes for videos

2. **Data Management**
   - Caching of previously loaded JSON files
   - Export of user preference data
   - Multiple JSON file support

3. **Visual Analytics**
   - Statistics about the user's watching habits
   - Visual representation of difficulty progression (including a graph showing history of difficulty of views, whether each was rated too easy, too hard, or right level, and the user's estimated level over time)
   - Learning path suggestions

4. **Accessibility & Performance**
   - Full keyboard navigation
   - Screen reader optimization
   - Performance optimizations for large datasets

## 8. Visual Design Style

The application will follow these design principles:

1. **Clean & Minimalistic**: Focus on content rather than decorative elements
   - Limited color palette (2-3 primary colors with accents)
   - Ample white space to reduce visual clutter
   - Clear visual hierarchy

2. **Learning-Focused Environment**:
   - Reduced animations and distractions
   - Clear typography with excellent readability
   - Visual cues for difficulty levels (subtle color coding or icons)

3. **Intuitive Navigation**:
   - Consistent layout with predictable patterns
   - Clear affordances for interactive elements
   - Visual feedback for actions

4. **Responsive Design**:
   - Adapts seamlessly to different screen sizes
   - Maintains usability across devices
   - Preserves content hierarchy in compact views