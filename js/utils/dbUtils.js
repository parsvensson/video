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
