# VideoBrowser: Current Product Description

## 1. Overview

VideoBrowser is a lightweight desktop web application for browsing and launching YouTube videos from a local JSON metadata file. It is intended for personal video libraries and works entirely offline except when opening a video on YouTube.

## 2. Current Features

### 2.1 Loading Video Data
* Select a local JSON file on startup.
* The application validates basic structure and caches the data in IndexedDB for quicker reloads.

### 2.2 Video Listing
* Displays videos in a paginated grid (15 items per page).
* Each card shows the title, duration, difficulty score and level.
* Tags and guides are displayed and can be clicked to trigger a search/filter.
* Details such as description, tags and guides can be toggled with a **Show Details** button.
* A "Watch on YouTube" button opens the video in a new browser tab.
* Previously watched videos are indicated with a badge.

### 2.3 Search, Filter and Sort
* Text search across title, tags and guides.
* Filters for level, sound quality and guide via dropdowns.
* Sorting by difficulty (default), publication date, duration or title.
* Active filters are summarized on the page and can be cleared with a single button.

### 2.4 Difficulty Feedback
* "Too Easy", "Right Level" and "Too Hard" buttons allow rating a video.
* Feedback updates the user's target difficulty which influences sorting of future sessions.
* Difficulty preference and feedback history are stored in `localStorage`.

### 2.5 History and State Management
* Watched videos are tracked with timestamps.
* A **View History** dialog lists watched videos with the date viewed.
* Application state (videos and preferences) can be exported to or imported from a JSON file.

## 3. Technical Context
* Works entirely in the browser using vanilla JavaScript and plain CSS.
* Video data and preferences are stored locally using IndexedDB and `localStorage`.
* Only the YouTube watch action requires an internet connection.
* The application never modifies the source JSON file.

## 4. Out of Scope
* Downloading or editing videos.
* Interacting with YouTube APIs beyond opening a video.
* User accounts or cloud sync.
* Complex database management.
* Displaying thumbnails (not currently implemented).

## 5. Visual Style
* Clean layout with minimal distractions.
* Responsive grid for video cards.
* Color cues highlight difficulty and interaction states.
