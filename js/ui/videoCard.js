import { getLatestFeedbackForVideo } from '../learning/difficultyManager.js';

function appendClickableItems(element, label, items, className) {
    element.textContent = `${label}: `;
    if (Array.isArray(items) && items.length > 0) {
        items.forEach((item, index) => {
            if (index > 0) element.append(', ');
            const span = document.createElement('span');
            span.className = className;
            span.textContent = item;
            element.appendChild(span);
        });
    } else {
        element.append('N/A');
    }
}

export function createVideoCard(video, onWatchCallback, onTooEasyCallback, onTooHardCallback, onRightLevelCallback, isWatched) {
    const cardElement = document.createElement('div');
    cardElement.className = 'video-card';
    if (isWatched) {
        cardElement.classList.add('watched');
        const watchedBadge = document.createElement('span');
        watchedBadge.className = 'watched-indicator';
        watchedBadge.textContent = 'Watched';
        cardElement.appendChild(watchedBadge);
    }
    cardElement.dataset.videoId = video._id;

    const titleElement = document.createElement('h3');
    titleElement.textContent = video.title;

    const latestFeedback = getLatestFeedbackForVideo(video._id);
    if (latestFeedback) {
        const feedbackDisplay = document.createElement('p');
        feedbackDisplay.className = 'latest-feedback';
        const ratedDate = new Date(latestFeedback.timestamp).toLocaleDateString();
        let feedbackText = 'Previously rated: ';
        switch (latestFeedback.feedback) {
            case 'tooEasy':
                feedbackText += 'Too Easy';
                break;
            case 'tooHard':
                feedbackText += 'Too Hard';
                break;
            case 'rightLevel':
                feedbackText += 'Right Level';
                break;
        }
        feedbackDisplay.textContent = `${feedbackText} on ${ratedDate}`;
        cardElement.appendChild(feedbackDisplay);
    }

    const guidesElement = document.createElement('p');
    guidesElement.className = 'guides';
    appendClickableItems(guidesElement, 'Guides', video.guides, 'clickable-guide');
    guidesElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('clickable-guide')) {
            guidesElement.dispatchEvent(new CustomEvent('guideClicked', {
                bubbles: true,
                detail: event.target.textContent
            }));
        }
    });

    const metadataElement = document.createElement('div');
    metadataElement.className = 'metadata';

    const durationSpan = document.createElement('span');
    durationSpan.className = 'duration';
    durationSpan.textContent = `Duration: ${formatDuration(video.duration)}`;

    const difficultySpan = document.createElement('span');
    difficultySpan.className = 'difficulty';
    difficultySpan.textContent = `Difficulty: ${video.difficultyScore}`;

    const levelSpan = document.createElement('span');
    levelSpan.className = 'level';
    levelSpan.textContent = `Level: ${video.level}`;

    metadataElement.append(durationSpan, difficultySpan, levelSpan);

    const watchButton = document.createElement('button');
    watchButton.className = 'watch-button';
    watchButton.textContent = 'Watch on YouTube';
    watchButton.addEventListener('click', () => onWatchCallback(video));

    const feedbackButtonsContainer = document.createElement('div');
    feedbackButtonsContainer.className = 'feedback-buttons';

    const tooEasyButton = document.createElement('button');
    tooEasyButton.className = 'too-easy-button';
    tooEasyButton.textContent = 'Too Easy';
    tooEasyButton.addEventListener('click', () => onTooEasyCallback(video));

    const tooHardButton = document.createElement('button');
    tooHardButton.className = 'too-hard-button';
    tooHardButton.textContent = 'Too Hard';
    tooHardButton.addEventListener('click', () => onTooHardCallback(video));

    const rightLevelButton = document.createElement('button');
    rightLevelButton.className = 'right-level-button';
    rightLevelButton.textContent = 'Right Level';
    rightLevelButton.addEventListener('click', () => onRightLevelCallback(video));

    feedbackButtonsContainer.append(tooEasyButton, rightLevelButton, tooHardButton);

    // Expandable details
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'video-details-extra';
    detailsContainer.style.display = 'none'; // Initially hidden

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `Description: ${video.description || 'N/A'}`;

    const tagsElement = document.createElement('p');
    appendClickableItems(tagsElement, 'Tags', video.tags, 'clickable-tag');
    tagsElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('clickable-tag')) {
            tagsElement.dispatchEvent(new CustomEvent('tagClicked', {
                bubbles: true,
                detail: event.target.textContent
            }));
        }
    });

    const guidesDetailsElement = document.createElement('p');
    appendClickableItems(guidesDetailsElement, 'Guides', video.guides, 'clickable-guide');
    guidesDetailsElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('clickable-guide')) {
            guidesDetailsElement.dispatchEvent(new CustomEvent('guideClicked', {
                bubbles: true,
                detail: event.target.textContent
            }));
        }
    });

    detailsContainer.append(descriptionElement, tagsElement, guidesDetailsElement);

    const expandButton = document.createElement('button');
    expandButton.className = 'expand-details-button';
    expandButton.textContent = 'Show Details';
    expandButton.addEventListener('click', () => {
        const isHidden = detailsContainer.style.display === 'none';
        detailsContainer.style.display = isHidden ? 'block' : 'none';
        expandButton.textContent = isHidden ? 'Hide Details' : 'Show Details';
    });

    cardElement.append(titleElement, guidesElement, metadataElement, watchButton, feedbackButtonsContainer, expandButton, detailsContainer);
    return cardElement;
}

export function formatDuration(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
