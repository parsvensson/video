const TARGET_DIFFICULTY_KEY = 'targetDifficulty';
const FEEDBACK_HISTORY_KEY = 'feedbackHistory';
const DIFFICULTY_ADJUSTMENT_STEP = 5; // Points to adjust by for easy/hard

// Load target difficulty from localStorage
export function loadTargetDifficulty() {
    const savedDifficulty = localStorage.getItem(TARGET_DIFFICULTY_KEY);
    if (savedDifficulty !== null) {
        return parseFloat(savedDifficulty);
    }
    return null; // Indicates no saved difficulty, app should calculate initial
}

// Save target difficulty to localStorage
export function saveTargetDifficulty(difficulty) {
    if (difficulty !== null) {
        localStorage.setItem(TARGET_DIFFICULTY_KEY, difficulty.toString());
    }
}

// Load feedback history from localStorage
export function loadFeedbackHistory() {
    const history = localStorage.getItem(FEEDBACK_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

// Save feedback history to localStorage
function saveFeedbackHistory(history) {
    localStorage.setItem(FEEDBACK_HISTORY_KEY, JSON.stringify(history));
}

// Add a feedback entry and update target difficulty
export function recordFeedback(videoId, videoDifficultyScore, feedbackType, currentTargetDifficulty) {
    let newTargetDifficulty = currentTargetDifficulty;
    const feedbackHistory = loadFeedbackHistory();

    feedbackHistory.push({
        videoId,
        videoDifficultyScore,
        feedback: feedbackType,
        timestamp: new Date().toISOString()
    });
    saveFeedbackHistory(feedbackHistory);

    switch (feedbackType) {
        case 'tooEasy':
            // If video was too easy, user's level is likely higher than video.
            // So, we might want to increase the target difficulty.
            newTargetDifficulty = Math.min(100, currentTargetDifficulty + DIFFICULTY_ADJUSTMENT_STEP); // Assuming 100 is max difficulty
            break;
        case 'tooHard':
            // If video was too hard, user's level is likely lower than video.
            // So, we might want to decrease the target difficulty.
            newTargetDifficulty = Math.max(0, currentTargetDifficulty - DIFFICULTY_ADJUSTMENT_STEP); // Assuming 0 is min difficulty
            break;
        case 'rightLevel':
            // Nudge target difficulty towards the video's actual difficulty score
            // This could be a weighted average or a direct move if significantly different
            if (Math.abs(currentTargetDifficulty - videoDifficultyScore) > DIFFICULTY_ADJUSTMENT_STEP / 2) {
                 // Simple nudge: move halfway towards the video's score, or by a fixed step
                newTargetDifficulty = currentTargetDifficulty + (videoDifficultyScore - currentTargetDifficulty) / 2;
            }
            // Ensure it stays within bounds
            newTargetDifficulty = Math.max(0, Math.min(100, newTargetDifficulty));
            break;
        default:
            console.warn(`Unknown feedback type: ${feedbackType}`);
            return currentTargetDifficulty; // Return original if feedback is unknown
    }
    
    // Clamp target difficulty to a sensible range (e.g., 0-100, or based on data min/max)
    newTargetDifficulty = Math.max(0, Math.min(100, newTargetDifficulty));
    
    saveTargetDifficulty(newTargetDifficulty);
    return newTargetDifficulty;
}

// Calculate initial target difficulty (e.g., median of all video difficulties)
// This function would need access to allVideos, so it might be better placed in app.js
// or allVideos passed as an argument. For now, keeping it conceptual here.
export function calculateInitialDifficulty(allVideos) {
    if (!allVideos || allVideos.length === 0) {
        return 50; // Default if no videos
    }
    const difficultyScores = allVideos.map(v => v.difficultyScore).sort((a, b) => a - b);
    const mid = Math.floor(difficultyScores.length / 2);
    let medianDifficulty;
    if (difficultyScores.length % 2 !== 0) {
        medianDifficulty = difficultyScores[mid];
    } else {
        medianDifficulty = (difficultyScores[mid - 1] + difficultyScores[mid]) / 2;
    }
    return Math.max(0, Math.min(100, medianDifficulty)); // Clamp initial difficulty
}

// Get the latest feedback for a specific video
export function getLatestFeedbackForVideo(videoId) {
    const feedbackHistory = loadFeedbackHistory();
    const videoFeedback = feedbackHistory
        .filter(entry => entry.videoId === videoId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first
    return videoFeedback.length > 0 ? videoFeedback[0] : null;
}
