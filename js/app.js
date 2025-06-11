import { loadVideoData, validateBasicStructure } from './dataLoader.js';
import { createVideoCard, formatDuration } from './ui/videoCard.js';
import { openYouTubeVideo, trackWatchedVideo } from './utils/youtubeUtils.js';
import { sortByDifficulty, searchVideos, applyFilters } from './utils/videoUtils.js';
import { getVideosFromDB, saveVideosToDB } from './utils/dbUtils.js'; // Added getVideosFromDB and saveVideosToDB
import { 
    loadTargetDifficulty as loadDifficultySetting,
    saveTargetDifficulty as saveDifficultySetting,
    recordFeedback,
    calculateInitialDifficulty as calculateInitialUserDifficulty,
    loadFeedbackHistory
} from './learning/difficultyManager.js';

let allVideos = [];
let currentVideos = [];
let currentPage = 1;
const videosPerPage = 15;
let targetDifficulty = null; // User's learned/preferred difficulty level

const fileInput = document.getElementById('fileInput');
const videoListElement = document.getElementById('videoList');
const searchBar = document.getElementById('searchBar');
const levelFilterElement = document.getElementById('levelFilter');
const soundQualityFilterElement = document.getElementById('soundQualityFilter');
const guideFilterElement = document.getElementById('guideFilter'); // Added guide filter element
const sortOptionsElement = document.getElementById('sortOptions');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const pageInfoElement = document.getElementById('pageInfo');
const muchEasierPageButton = document.getElementById('muchEasierPage');
const muchHarderPageButton = document.getElementById('muchHarderPage');
const clearFiltersButton = document.getElementById('clearFiltersButton');
const viewHistoryButton = document.getElementById('viewHistoryButton');

// --- Initialization ---
async function initializeApp() {
    currentPage = loadCurrentPage(); // Load the saved page or default to 1
    fileInput.addEventListener('change', handleFileSelect);
    searchBar.addEventListener('input', handleSearchAndFilter);
    levelFilterElement.addEventListener('change', handleSearchAndFilter);
    soundQualityFilterElement.addEventListener('change', handleSearchAndFilter);
    guideFilterElement.addEventListener('change', handleSearchAndFilter);
    sortOptionsElement.addEventListener('change', handleSortChange);
    prevPageButton.addEventListener('click', () => changePage(currentPage - 1));
    nextPageButton.addEventListener('click', () => changePage(currentPage + 1));
    muchEasierPageButton.addEventListener('click', () => changePage(Math.max(1, currentPage - 5))); // Jump 5 pages, or to page 1
    muchHarderPageButton.addEventListener('click', () => changePage(currentPage + 5)); // Jump 5 pages
    clearFiltersButton.addEventListener('click', clearAllFilters);
    viewHistoryButton.addEventListener('click', showViewHistoryPopup);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Load data from IndexedDB if available
    try {
        const dbVideos = await getVideosFromDB();
        if (dbVideos) {
            allVideos = dbVideos;
            if (validateBasicStructure(allVideos)) {
                console.log('Loaded data from IndexedDB');
                targetDifficulty = loadDifficultySetting(); // Load from difficultyManager
                if (targetDifficulty === null) {
                    targetDifficulty = calculateInitialUserDifficulty(allVideos); // Calculate if not found
                    saveDifficultySetting(targetDifficulty);
                }
                processAndDisplayVideos();
            } else {
                // This case should ideally not happen if data was saved correctly
                console.warn('Invalid data structure in IndexedDB. Please re-select file.');
            }
        } else {
            console.log('No data in IndexedDB. Please select a file.');
        }
    } catch (error) {
        console.error('Error loading data from IndexedDB:', error);
        // Fallback or error message if DB access fails
    }
}

// --- Save Current Page to localStorage ---
function saveCurrentPage() {
    localStorage.setItem('currentPage', currentPage);
}

// --- Update URL with Page Number ---
function updatePageInURL(page) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
}

// --- Load Page from URL or localStorage ---
function loadCurrentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromURL = urlParams.get('page');
    if (pageFromURL) {
        return parseInt(pageFromURL, 10);
    }
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
}

// --- File Handling ---
async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        try {
            videoListElement.innerHTML = '<p>Loading videos...</p>';
            allVideos = await loadVideoData(file);
            await saveVideosToDB(allVideos); // Save to IndexedDB (from dbUtils.js)
            
            targetDifficulty = loadDifficultySetting(); // Load from difficultyManager
            if (targetDifficulty === null || allVideos.length > 0) { // Recalculate if new file or no setting
                targetDifficulty = calculateInitialUserDifficulty(allVideos);
                saveDifficultySetting(targetDifficulty);
            }
            processAndDisplayVideos();
        } catch (error) {
            videoListElement.innerHTML = `<p>Error loading file: ${error.message}. Please select a valid JSON file.</p>`;
            console.error('File loading error:', error);
        }
    }
}

function processAndDisplayVideos() {
    if (allVideos.length === 0) {
        videoListElement.innerHTML = '<p>No videos found in the selected file.</p>';
        return;
    }
    populateGuideFilter(); // Populate guide filter options
    applyCurrentFiltersAndSort();
    renderVideoPage();
}

// --- UI Population ---
function populateGuideFilter() {
    if (!guideFilterElement) return; // Guard clause
    const guides = new Set();
    allVideos.forEach(video => {
        if (video.guides && Array.isArray(video.guides)) {
            video.guides.forEach(guide => guides.add(guide));
        }
    });

    // Clear existing options except the first one ("All Guides")
    while (guideFilterElement.options.length > 1) {
        guideFilterElement.remove(1);
    }

    Array.from(guides).sort().forEach(guide => {
        const option = document.createElement('option');
        option.value = guide;
        option.textContent = guide;
        guideFilterElement.appendChild(option);
    });
}

// --- Search, Filter, Sort ---
function handleSearchAndFilter() {
    currentPage = 1; // Reset to first page on new search/filter
    applyCurrentFiltersAndSort();
    renderVideoPage();
    updateActiveFiltersDisplay(); // Update visual indicators for filters
}

function handleSortChange() {
    currentPage = 1;
    applyCurrentFiltersAndSort();
    renderVideoPage();
}

function applyCurrentFiltersAndSort() {
    let filtered = [...allVideos];
    const activeFiltersForDisplay = [];

    // Apply text search
    const searchTerm = searchBar.value;
    if (searchTerm) {
        filtered = searchVideos(filtered, searchTerm);
        activeFiltersForDisplay.push(`Search: \"${searchTerm}\"`);
    }

    // Apply dropdown filters
    const selectedLevel = levelFilterElement.value;
    const selectedSoundQuality = soundQualityFilterElement.value;
    const selectedGuide = guideFilterElement.value;
    const activeFilters = {};
    if (selectedLevel) {
        activeFilters.level = selectedLevel;
        activeFiltersForDisplay.push(`Level: ${selectedLevel}`);
    }
    if (selectedSoundQuality) {
        activeFilters.soundQuality = selectedSoundQuality;
        activeFiltersForDisplay.push(`Sound: ${selectedSoundQuality}`);
    }
    if (selectedGuide) {
        activeFilters.guide = selectedGuide;
        activeFiltersForDisplay.push(`Guide: ${selectedGuide}`);
    }

    if (Object.keys(activeFilters).length > 0) {
        filtered = applyFilters(filtered, activeFilters);
    }
    
    // Store active filters for display
    sessionStorage.setItem('activeFiltersForDisplay', JSON.stringify(activeFiltersForDisplay));


    // Apply sorting
    const sortBy = sortOptionsElement.value;
    switch (sortBy) {
        case 'publishedAt':
            filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
            break;
        case 'duration':
            filtered.sort((a, b) => a.duration - b.duration);
            break;
        case 'title':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'difficultyScore': // This is the default initial sort
        default:
            // Sort by proximity to targetDifficulty
            filtered.sort((a, b) => {
                const diffA = Math.abs(a.difficultyScore - targetDifficulty);
                const diffB = Math.abs(b.difficultyScore - targetDifficulty);
                if (diffA === diffB) {
                    // Secondary sort by actual difficulty if proximity is the same
                    return a.difficultyScore - b.difficultyScore;
                }
                return diffA - diffB;
            });
            break;
    }
    currentVideos = filtered;
}

// --- Rendering & Pagination ---
function renderVideoPage() {
    videoListElement.innerHTML = ''; // Clear previous videos
    const watchedHistory = JSON.parse(localStorage.getItem('watchedHistory') || '[]');

    if (currentVideos.length === 0) {
        videoListElement.innerHTML = '<p>No videos match your current filters.</p>';
        updatePaginationControls(0);
        return;
    }

    const startIndex = (currentPage - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    const videosToDisplay = currentVideos.slice(startIndex, endIndex);

    videosToDisplay.forEach(video => {
        const isWatched = watchedHistory.includes(video._id);
        const videoCard = createVideoCard(video, handleWatchVideo, handleTooEasy, handleTooHard, handleRightLevel, isWatched);
        videoListElement.appendChild(videoCard);
    });

    updatePaginationControls(currentVideos.length);
}

function updatePaginationControls(totalVideos) {
    const totalPages = Math.ceil(totalVideos / videosPerPage);
    pageInfoElement.textContent = `Page ${currentPage} of ${totalPages > 0 ? totalPages : 1}`;

    prevPageButton.textContent = 'Easier';
    nextPageButton.textContent = 'Harder';

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages || totalPages === 0;
    muchEasierPageButton.disabled = currentPage <= 1; // Disable if on page 1 or less (though should not be less)
    muchHarderPageButton.disabled = currentPage >= totalPages -4; // Disable if not enough pages to jump 5

}

// --- Change Page ---
function changePage(newPage) {
    const totalPages = Math.ceil(currentVideos.length / videosPerPage);
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        saveCurrentPage(); // Save the current page to localStorage
        updatePageInURL(currentPage); // Update the URL with the new page number
        renderVideoPage();
    }
}

// --- Video Actions ---
function handleWatchVideo(video) {
    openYouTubeVideo(video.sources.youtube || video.hostingId);
    trackWatchedVideo(video._id);
    renderVideoPage(); // Re-render to update watched status if necessary
}

// --- Difficulty Feedback ---
function handleTooEasy(video) {
    console.log(`Video "${video.title}" marked as Too Easy. Current target: ${targetDifficulty}`);
    targetDifficulty = recordFeedback(video._id, video.difficultyScore, 'tooEasy', targetDifficulty);
    console.log(`New target difficulty: ${targetDifficulty}`);
    applyCurrentFiltersAndSort();
    renderVideoPage();
}

function handleTooHard(video) {
    console.log(`Video "${video.title}" marked as Too Hard. Current target: ${targetDifficulty}`);
    targetDifficulty = recordFeedback(video._id, video.difficultyScore, 'tooHard', targetDifficulty);
    console.log(`New target difficulty: ${targetDifficulty}`);
    applyCurrentFiltersAndSort();
    renderVideoPage();
}

function handleRightLevel(video) {
    console.log(`Video "${video.title}" marked as Right Level. Current target: ${targetDifficulty}`);
    targetDifficulty = recordFeedback(video._id, video.difficultyScore, 'rightLevel', targetDifficulty);
    console.log(`New target difficulty: ${targetDifficulty}`);
    applyCurrentFiltersAndSort(); // Re-sort might be subtle here, but good for consistency
    renderVideoPage(); // Re-render, though visual change might be minimal
}

// --- UI Enhancements ---
function clearAllFilters() {
    searchBar.value = '';
    levelFilterElement.value = '';
    soundQualityFilterElement.value = '';
    guideFilterElement.value = '';
    // sortOptionsElement.value = 'difficultyScore'; // Optionally reset sort
    handleSearchAndFilter();
}

function updateActiveFiltersDisplay() {
    const activeFiltersDisplayElement = document.getElementById('activeFiltersDisplay');
    if (!activeFiltersDisplayElement) return;

    const activeFiltersForDisplay = JSON.parse(sessionStorage.getItem('activeFiltersForDisplay') || '[]');

    if (activeFiltersForDisplay.length > 0) {
        activeFiltersDisplayElement.innerHTML = `Active filters: ${activeFiltersForDisplay.map(f => `<span class="filter-chip">${f}</span>`).join(' ')}`;
    } else {
        activeFiltersDisplayElement.innerHTML = '';
    }
}

function handleKeyboardShortcuts(event) {
    // console.log(event.key);
    if (event.key === '/') {
        if (document.activeElement !== searchBar) {
            event.preventDefault();
            searchBar.focus();
        }
    }
    // Add more shortcuts here, e.g., for feedback, navigation
    // For navigating video list or giving feedback, we'd need to know which card is "active" or "selected"
    // This is a more complex UI state to manage.
}

// --- View History Popup ---
function showViewHistoryPopup() {
    const watchedHistory = JSON.parse(localStorage.getItem('watchedHistory') || '[]');
    const watchedDates = JSON.parse(localStorage.getItem('watchedDates') || '{}');

    // Create popup container
    const popupContainer = document.createElement('div');
    popupContainer.id = 'viewHistoryPopup';
    popupContainer.className = 'popup-container';

    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'close-button';
    closeButton.addEventListener('click', () => popupContainer.remove());
    popupContent.appendChild(closeButton);

    // Add title
    const title = document.createElement('h2');
    title.textContent = 'View History';
    popupContent.appendChild(title);

    if (watchedHistory.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No videos have been watched yet.';
        popupContent.appendChild(emptyMessage);
    } else {
        // Sort videos by latest view date
        const sortedWatchedVideos = watchedHistory.sort((a, b) => new Date(watchedDates[b]) - new Date(watchedDates[a]));

        // Use DocumentFragment for better performance when adding multiple elements
        const videoCardsFragment = document.createDocumentFragment();
        
        // Add video cards to fragment
        sortedWatchedVideos.forEach(videoId => {
            const video = allVideos.find(v => v._id === videoId);
            if (video) {
                const isWatched = true; // All videos in history are watched
                const videoCard = createVideoCard(video, handleWatchVideo, handleTooEasy, handleTooHard, handleRightLevel, isWatched);
                const dateElement = document.createElement('p');
                dateElement.textContent = `Viewed on: ${new Date(watchedDates[videoId]).toLocaleString()}`;
                videoCard.appendChild(dateElement);
                videoCardsFragment.appendChild(videoCard);
            }
        });
        
        // Add all cards to DOM at once for better performance
        popupContent.appendChild(videoCardsFragment);
    }
    popupContainer.appendChild(popupContent);
    document.body.appendChild(popupContainer);
}

// --- Initialization Call ---
initializeApp();
