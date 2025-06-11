export function openYouTubeVideo(youtubeId) {
    if (!youtubeId) {
        console.error('YouTube ID is missing.');
        return;
    }
    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    window.open(youtubeUrl, '_blank');
}

export function trackWatchedVideo(videoId) {
    if (!videoId) return;
    try {
        let watchedHistory = JSON.parse(localStorage.getItem('watchedHistory') || '[]');
        if (!watchedHistory.includes(videoId)) {
            watchedHistory.push(videoId);
            localStorage.setItem('watchedHistory', JSON.stringify(watchedHistory));
        }

        // Also store timestamp of last watch
        let watchedDates = JSON.parse(localStorage.getItem('watchedDates') || '{}');
        watchedDates[videoId] = new Date().toISOString();
        localStorage.setItem('watchedDates', JSON.stringify(watchedDates));

        console.log(`Tracked video ${videoId} as watched.`);
    } catch (error) {
        console.error('Error tracking watched video:', error);
    }
}
