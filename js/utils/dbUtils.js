const DB_NAME = 'VideoBrowserDB';
const STORE_NAME = 'videos';
const DB_VERSION = 1;

export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: '_id' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
            reject('Error opening IndexedDB.');
        };
    });
}

export async function saveVideosToDB(videos) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        // Clear existing data first
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => {
            // Add new videos
            videos.forEach(video => {
                store.put(video);
            });
        };
        clearRequest.onerror = (event) => {
            console.error('Error clearing store:', event.target.error);
            reject('Error clearing store before saving new videos.');
        }

        transaction.oncomplete = () => {
            console.log('Videos saved to IndexedDB successfully.');
            resolve();
        };

        transaction.onerror = (event) => {
            console.error('Error saving videos to IndexedDB:', event.target.error);
            reject('Error saving videos to IndexedDB.');
        };
    });
}

export async function getVideosFromDB() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = (event) => {
            if (event.target.result && event.target.result.length > 0) {
                resolve(event.target.result);
            } else {
                resolve(null); // No data found
            }
        };

        request.onerror = (event) => {
            console.error('Error fetching videos from IndexedDB:', event.target.error);
            reject('Error fetching videos from IndexedDB.');
        };
    });
}

export async function exportAppState() {
    const db = await openDB();
    const videos = await new Promise((resolve, reject) => {
        const tx = db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
    });

    const state = {
        videos,
        localStorage: {
            targetDifficulty: localStorage.getItem('targetDifficulty'),
            feedbackHistory: JSON.parse(localStorage.getItem('feedbackHistory') || '[]'),
            watchedHistory: JSON.parse(localStorage.getItem('watchedHistory') || '[]'),
            watchedDates: JSON.parse(localStorage.getItem('watchedDates') || '{}'),
            currentPage: localStorage.getItem('currentPage')
        }
    };

    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'videobrowser_state.json';
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
}

export async function importAppState(file) {
    const text = await file.text();
    const state = JSON.parse(text);
    const ls = state.localStorage || {};
    if (ls.targetDifficulty !== undefined) localStorage.setItem('targetDifficulty', ls.targetDifficulty);
    if (ls.feedbackHistory) localStorage.setItem('feedbackHistory', JSON.stringify(ls.feedbackHistory));
    if (ls.watchedHistory) localStorage.setItem('watchedHistory', JSON.stringify(ls.watchedHistory));
    if (ls.watchedDates) localStorage.setItem('watchedDates', JSON.stringify(ls.watchedDates));
    if (ls.currentPage !== undefined) localStorage.setItem('currentPage', ls.currentPage);
    if (Array.isArray(state.videos)) {
        await saveVideosToDB(state.videos);
    }
}
