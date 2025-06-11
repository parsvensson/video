export function sortByDifficulty(videos) {
    return [...videos].sort((a, b) => a.difficultyScore - b.difficultyScore);
}

export function searchVideos(videos, query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return videos;

    return videos.filter(video => {
        if (video.title && video.title.toLowerCase().includes(searchTerm)) return true;
        if (video.tags && video.tags.some(tag => tag.toLowerCase().includes(searchTerm))) return true;
        if (video.guides && video.guides.some(guide => guide.toLowerCase().includes(searchTerm))) return true;
        // Description search can be intensive, consider if it's essential for MVP performance
        // if (video.description && video.description.toLowerCase().includes(searchTerm)) return true;
        return false;
    });
}

export function applyFilters(videos, filters) {
    return videos.filter(video => {
        if (filters.level && video.level !== filters.level) return false;
        if (filters.soundQuality && video.soundQuality !== filters.soundQuality) return false;
        if (filters.guide && video.guides && !video.guides.includes(filters.guide)) return false;
        // Add other filters like difficulty range if needed in future phases
        // if (filters.minDifficulty !== undefined && video.difficultyScore < filters.minDifficulty) return false;
        // if (filters.maxDifficulty !== undefined && video.difficultyScore > filters.maxDifficulty) return false;
        return true;
    });
}
