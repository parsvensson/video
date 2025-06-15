// js/dataLoader.js
async function loadVideoData(file) {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!validateBasicStructure(data)) {
      throw new Error("Invalid file format. The file does not seem to be an array of videos or is missing key properties.");
    }
    console.log(`Loaded ${data.length} videos.`);
    return data;
  } catch (error) {
    console.error("Error loading or parsing JSON file:", error);
    throw error;
  }
}
function validateBasicStructure(data) {
  if (!Array.isArray(data)) {
    console.error("Validation failed: Data is not an array.");
    return false;
  }
  if (data.length === 0) {
    console.log("Validation: Data is an empty array.");
    return true;
  }
  const firstItem = data[0];
  const requiredProps = ["_id", "title", "duration", "difficultyScore", "level", "sources", "hostingId"];
  const missingProps = requiredProps.filter((prop) => !(prop in firstItem));
  if (missingProps.length > 0) {
    console.error(`Validation failed: First item is missing properties: ${missingProps.join(", ")}`);
    return false;
  }
  if (!firstItem.sources || !firstItem.sources.youtube && !firstItem.hostingId) {
    if (!firstItem.hostingId) {
      console.error("Validation failed: First item is missing sources.youtube and hostingId.");
      return false;
    }
  }
  console.log("Basic structure validation passed.");
  return true;
}

// js/supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
var SUPABASE_URL = window.SUPABASE_URL || "";
console.log("Supabase URL:", SUPABASE_URL);
var SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "";
console.log("Supabase Anon Key:", SUPABASE_ANON_KEY);
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Supabase URL or Anon Key is missing. Please check environment variables or window object.");
}
var supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// js/auth.js
var signUpForm;
var loginForm;
var userStatus;
var authMessages;
var userEmailDisplay;
var signUpButton;
var loginButton;
var logoutButton;
var signUpEmailInput;
var signUpPasswordInput;
var loginEmailInput;
var loginPasswordInput;
function initAuthUI() {
  signUpForm = document.getElementById("signUpForm");
  loginForm = document.getElementById("loginForm");
  userStatus = document.getElementById("userStatus");
  authMessages = document.getElementById("authMessages");
  userEmailDisplay = document.getElementById("userEmail");
  signUpButton = document.getElementById("signUpButton");
  loginButton = document.getElementById("loginButton");
  logoutButton = document.getElementById("logoutButton");
  signUpEmailInput = document.getElementById("signUpEmail");
  signUpPasswordInput = document.getElementById("signUpPassword");
  loginEmailInput = document.getElementById("loginEmail");
  loginPasswordInput = document.getElementById("loginPassword");
  if (signUpForm) {
    signUpForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await handleSignUp();
    });
  }
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await handleLogin();
    });
  }
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      await handleLogout();
    });
  }
}
async function handleSignUp() {
  const email = signUpEmailInput.value;
  const password = signUpPasswordInput.value;
  authMessages.textContent = "";
  console.log("Attempting sign-up with email:", email);
  if (!email || !password) {
    console.error("Email or password is empty during sign-up attempt.");
    authMessages.textContent = "Email or password cannot be empty.";
    return;
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error("Detailed sign-up error:", error);
    if (error.message.includes("User already registered")) {
      console.warn("Sign-up attempt for an already registered email:", email);
      authMessages.textContent = "This email is already registered. Try logging in.";
    } else if (error.message.includes("rate limit exceeded")) {
      console.warn("Sign-up rate limit exceeded. Please try again later.");
      authMessages.textContent = "Too many sign-up attempts. Please try again later.";
    } else if (error.message.includes("network error")) {
      console.error("Sign-up failed due to a network error. Check internet connection and Supabase status.");
      authMessages.textContent = "Sign-up failed due to a network error. Please check your connection.";
    } else if (error.message.toLowerCase().includes("password should be at least 6 characters")) {
      console.warn("Sign-up failed due to a weak password.");
      authMessages.textContent = "Password should be at least 6 characters long.";
    } else {
      authMessages.textContent = `Sign-up error: ${error.message}`;
    }
  } else if (data && (!data.user || data.user && !data.user.id)) {
    console.warn("Sign-up successful but no user data returned or user ID is missing. This might indicate issues with email confirmation settings in Supabase.", data);
    authMessages.textContent = "Sign-up may require email verification. Please check your inbox and Supabase settings.";
    console.log("Sign-up data issue:", data);
  } else {
    authMessages.textContent = "Sign-up successful! Check your email for verification.";
    console.log("Sign-up successful, user data:", data.user);
    console.log("Sign-up data:", data);
  }
}
async function handleLogin() {
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;
  authMessages.textContent = "";
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    authMessages.textContent = `Login error: ${error.message}`;
    console.error("Login error:", error);
  } else {
    console.log("Login successful:", data);
  }
}
async function handleLogout() {
  authMessages.textContent = "";
  const { error } = await supabase.auth.signOut();
  if (error) {
    authMessages.textContent = `Logout error: ${error.message}`;
    console.error("Logout error:", error);
  } else {
    console.log("Logout successful");
  }
}
function updateAuthUI(user) {
  if (user) {
    if (signUpForm)
      signUpForm.style.display = "none";
    if (loginForm)
      loginForm.style.display = "none";
    if (userStatus)
      userStatus.style.display = "block";
    if (userEmailDisplay)
      userEmailDisplay.textContent = user.email;
    if (authMessages.textContent.includes("successful") || authMessages.textContent.includes("verification")) {
    } else {
      authMessages.textContent = "";
    }
  } else {
    if (signUpForm)
      signUpForm.style.display = "block";
    if (loginForm)
      loginForm.style.display = "block";
    if (userStatus)
      userStatus.style.display = "none";
    if (userEmailDisplay)
      userEmailDisplay.textContent = "";
  }
}
async function checkUserSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    console.log("User session found:", session);
  } else {
    console.log("No active user session.");
    updateAuthUI(null);
  }
}
supabase.auth.onAuthStateChange((event, session) => {
  console.log("onAuthStateChange - Event:", event, "Session:", session);
  const user = session ? session.user : null;
  updateAuthUI(user);
  if (session && session.user) {
    console.log("onAuthStateChange - User details: ID:", session.user.id, "Email:", session.user.email, "Authenticated:", session.user.aud);
  } else if (session) {
    console.warn("onAuthStateChange - Session exists but no user object found in session:", session);
  } else {
    console.log("onAuthStateChange - No active session.");
  }
  if (event === "SIGNED_IN") {
    console.log("onAuthStateChange - SIGNED_IN event detected. User should be authenticated.");
    authMessages.textContent = "Successfully logged in!";
  } else if (event === "SIGNED_OUT") {
    authMessages.textContent = "You have been logged out.";
    if (signUpEmailInput)
      signUpEmailInput.value = "";
    if (signUpPasswordInput)
      signUpPasswordInput.value = "";
    if (loginEmailInput)
      loginEmailInput.value = "";
    if (loginPasswordInput)
      loginPasswordInput.value = "";
  } else if (event === "USER_UPDATED") {
    console.log("onAuthStateChange - USER_UPDATED event. User details:", session ? session.user : "No session");
    authMessages.textContent = "User profile updated.";
  } else if (event === "PASSWORD_RECOVERY") {
    authMessages.textContent = "Password recovery email sent.";
  } else if (event === "TOKEN_REFRESHED") {
    console.log("Token refreshed");
    console.log("onAuthStateChange - TOKEN_REFRESHED event. Current session:", session);
  }
  if (authMessages.textContent && !authMessages.textContent.toLowerCase().includes("error") && !authMessages.textContent.toLowerCase().includes("check your email")) {
    setTimeout(() => {
      authMessages.textContent = "";
    }, 5e3);
  }
});
async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }
    return data?.user || null;
  } catch (e) {
    console.error("Exception in getCurrentUser:", e);
    return null;
  }
}

// js/learning/difficultyManager.js
var TARGET_DIFFICULTY_KEY = "targetDifficulty";
var FEEDBACK_HISTORY_KEY = "feedbackHistory";
var DIFFICULTY_ADJUSTMENT_STEP = 5;
async function loadTargetDifficulty() {
  const user = await getCurrentUser();
  if (user) {
    try {
      const { data, error } = await supabase.from("user_profiles").select("target_difficulty").eq("id", user.id).single();
      if (error) {
        console.error("Error loading target difficulty from Supabase:", error);
      } else if (data && data.target_difficulty !== null) {
        return parseFloat(data.target_difficulty);
      }
    } catch (e) {
      console.error("Exception loading target difficulty from Supabase:", e);
    }
  }
  const savedDifficulty = localStorage.getItem(TARGET_DIFFICULTY_KEY);
  if (savedDifficulty !== null) {
    return parseFloat(savedDifficulty);
  }
  return null;
}
async function saveTargetDifficulty(difficulty) {
  if (difficulty === null)
    return;
  const user = await getCurrentUser();
  if (user) {
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        target_difficulty: difficulty,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (error) {
        console.error("Error saving target difficulty to Supabase:", error);
      }
    } catch (e) {
      console.error("Exception saving target difficulty to Supabase:", e);
    }
  }
  localStorage.setItem(TARGET_DIFFICULTY_KEY, difficulty.toString());
}
async function loadFeedbackHistory() {
  const user = await getCurrentUser();
  if (user) {
    try {
      const { data, error } = await supabase.from("user_profiles").select("feedback_history").eq("id", user.id).single();
      if (error) {
        console.error("Error loading feedback history from Supabase:", error);
      } else if (data && data.feedback_history) {
        return data.feedback_history;
      }
    } catch (e) {
      console.error("Exception loading feedback history from Supabase:", e);
    }
  }
  const history = localStorage.getItem(FEEDBACK_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}
async function saveFeedbackHistory(history) {
  const user = await getCurrentUser();
  if (user) {
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        feedback_history: history,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (error) {
        console.error("Error saving feedback history to Supabase:", error);
      }
    } catch (e) {
      console.error("Exception saving feedback history to Supabase:", e);
    }
  }
  localStorage.setItem(FEEDBACK_HISTORY_KEY, JSON.stringify(history));
}
async function recordFeedback(videoId, videoDifficultyScore, feedbackType, currentTargetDifficulty) {
  let newTargetDifficulty = currentTargetDifficulty;
  const feedbackHistory = await loadFeedbackHistory();
  feedbackHistory.push({
    videoId,
    videoDifficultyScore,
    feedback: feedbackType,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
  await saveFeedbackHistory(feedbackHistory);
  switch (feedbackType) {
    case "tooEasy":
      newTargetDifficulty = Math.min(100, currentTargetDifficulty + DIFFICULTY_ADJUSTMENT_STEP);
      break;
    case "tooHard":
      newTargetDifficulty = Math.max(0, currentTargetDifficulty - DIFFICULTY_ADJUSTMENT_STEP);
      break;
    case "rightLevel":
      if (Math.abs(currentTargetDifficulty - videoDifficultyScore) > DIFFICULTY_ADJUSTMENT_STEP / 2) {
        newTargetDifficulty = currentTargetDifficulty + (videoDifficultyScore - currentTargetDifficulty) / 2;
      }
      newTargetDifficulty = Math.max(0, Math.min(100, newTargetDifficulty));
      break;
    default:
      console.warn(`Unknown feedback type: ${feedbackType}`);
      return currentTargetDifficulty;
  }
  newTargetDifficulty = Math.max(0, Math.min(100, newTargetDifficulty));
  await saveTargetDifficulty(newTargetDifficulty);
  return newTargetDifficulty;
}
function calculateInitialDifficulty(allVideos2) {
  if (!allVideos2 || allVideos2.length === 0) {
    return 50;
  }
  const difficultyScores = allVideos2.map((v) => v.difficultyScore).sort((a, b) => a - b);
  const mid = Math.floor(difficultyScores.length / 2);
  let medianDifficulty;
  if (difficultyScores.length % 2 !== 0) {
    medianDifficulty = difficultyScores[mid];
  } else {
    medianDifficulty = (difficultyScores[mid - 1] + difficultyScores[mid]) / 2;
  }
  return Math.max(0, Math.min(100, medianDifficulty));
}
async function getLatestFeedbackForVideo(videoId) {
  const feedbackHistory = await loadFeedbackHistory();
  const videoFeedback = feedbackHistory.filter((entry) => entry.videoId === videoId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return videoFeedback.length > 0 ? videoFeedback[0] : null;
}

// js/ui/videoCard.js
function appendClickableItems(element, label, items, className) {
  element.textContent = `${label}: `;
  if (Array.isArray(items) && items.length > 0) {
    items.forEach((item, index) => {
      if (index > 0)
        element.append(", ");
      const span = document.createElement("span");
      span.className = className;
      span.textContent = item;
      element.appendChild(span);
    });
  } else {
    element.append("N/A");
  }
}
function createVideoCard(video, onWatchCallback, onTooEasyCallback, onTooHardCallback, onRightLevelCallback, isWatched) {
  const cardElement = document.createElement("div");
  cardElement.className = "video-card";
  if (isWatched) {
    cardElement.classList.add("watched");
    const watchedBadge = document.createElement("span");
    watchedBadge.className = "watched-indicator";
    watchedBadge.textContent = "Watched";
    cardElement.appendChild(watchedBadge);
  }
  cardElement.dataset.videoId = video._id;
  const titleElement = document.createElement("h3");
  titleElement.textContent = video.title;
  const latestFeedback = getLatestFeedbackForVideo(video._id);
  if (latestFeedback) {
    const feedbackDisplay = document.createElement("p");
    feedbackDisplay.className = "latest-feedback";
    const ratedDate = new Date(latestFeedback.timestamp).toLocaleDateString();
    let feedbackText = "Previously rated: ";
    switch (latestFeedback.feedback) {
      case "tooEasy":
        feedbackText += "Too Easy";
        break;
      case "tooHard":
        feedbackText += "Too Hard";
        break;
      case "rightLevel":
        feedbackText += "Right Level";
        break;
    }
    feedbackDisplay.textContent = `${feedbackText} on ${ratedDate}`;
    cardElement.appendChild(feedbackDisplay);
  }
  const guidesElement = document.createElement("p");
  guidesElement.className = "guides";
  appendClickableItems(guidesElement, "Guides", video.guides, "clickable-guide");
  guidesElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("clickable-guide")) {
      guidesElement.dispatchEvent(new CustomEvent("guideClicked", {
        bubbles: true,
        detail: event.target.textContent
      }));
    }
  });
  const metadataElement = document.createElement("div");
  metadataElement.className = "metadata";
  const durationSpan = document.createElement("span");
  durationSpan.className = "duration";
  durationSpan.textContent = `Duration: ${formatDuration(video.duration)}`;
  const difficultySpan = document.createElement("span");
  difficultySpan.className = "difficulty";
  difficultySpan.textContent = `Difficulty: ${video.difficultyScore}`;
  const levelSpan = document.createElement("span");
  levelSpan.className = "level";
  levelSpan.textContent = `Level: ${video.level}`;
  metadataElement.append(durationSpan, difficultySpan, levelSpan);
  const watchButton = document.createElement("button");
  watchButton.className = "watch-button";
  watchButton.textContent = "Watch on YouTube";
  watchButton.addEventListener("click", () => onWatchCallback(video));
  const feedbackButtonsContainer = document.createElement("div");
  feedbackButtonsContainer.className = "feedback-buttons";
  const tooEasyButton = document.createElement("button");
  tooEasyButton.className = "too-easy-button";
  tooEasyButton.textContent = "Too Easy";
  tooEasyButton.addEventListener("click", () => onTooEasyCallback(video));
  const tooHardButton = document.createElement("button");
  tooHardButton.className = "too-hard-button";
  tooHardButton.textContent = "Too Hard";
  tooHardButton.addEventListener("click", () => onTooHardCallback(video));
  const rightLevelButton = document.createElement("button");
  rightLevelButton.className = "right-level-button";
  rightLevelButton.textContent = "Right Level";
  rightLevelButton.addEventListener("click", () => onRightLevelCallback(video));
  feedbackButtonsContainer.append(tooEasyButton, rightLevelButton, tooHardButton);
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "video-details-extra";
  detailsContainer.style.display = "none";
  const descriptionElement = document.createElement("p");
  descriptionElement.textContent = `Description: ${video.description || "N/A"}`;
  const tagsElement = document.createElement("p");
  appendClickableItems(tagsElement, "Tags", video.tags, "clickable-tag");
  tagsElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("clickable-tag")) {
      tagsElement.dispatchEvent(new CustomEvent("tagClicked", {
        bubbles: true,
        detail: event.target.textContent
      }));
    }
  });
  const guidesDetailsElement = document.createElement("p");
  appendClickableItems(guidesDetailsElement, "Guides", video.guides, "clickable-guide");
  guidesDetailsElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("clickable-guide")) {
      guidesDetailsElement.dispatchEvent(new CustomEvent("guideClicked", {
        bubbles: true,
        detail: event.target.textContent
      }));
    }
  });
  detailsContainer.append(descriptionElement, tagsElement, guidesDetailsElement);
  const expandButton = document.createElement("button");
  expandButton.className = "expand-details-button";
  expandButton.textContent = "Show Details";
  expandButton.addEventListener("click", () => {
    const isHidden = detailsContainer.style.display === "none";
    detailsContainer.style.display = isHidden ? "block" : "none";
    expandButton.textContent = isHidden ? "Hide Details" : "Show Details";
  });
  cardElement.append(titleElement, guidesElement, metadataElement, watchButton, feedbackButtonsContainer, expandButton, detailsContainer);
  return cardElement;
}
function formatDuration(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// js/utils/youtubeUtils.js
function openYouTubeVideo(youtubeId) {
  if (!youtubeId) {
    console.error("YouTube ID is missing.");
    return;
  }
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
  window.open(youtubeUrl, "_blank");
}
async function trackWatchedVideo(videoId) {
  if (!videoId)
    return;
  const user = await getCurrentUser();
  if (user) {
    try {
      let { data: profile, error: fetchError } = await supabase.from("user_profiles").select("watched_history, watched_dates").eq("id", user.id).single();
      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching user profile for watched history:", fetchError);
        return;
      }
      let watchedHistory = profile && profile.watched_history ? profile.watched_history : [];
      let watchedDates = profile && profile.watched_dates ? profile.watched_dates : {};
      if (!watchedHistory.includes(videoId)) {
        watchedHistory.push(videoId);
      }
      watchedDates[videoId] = (/* @__PURE__ */ new Date()).toISOString();
      const { error: upsertError } = await supabase.from("user_profiles").upsert({
        id: user.id,
        watched_history: watchedHistory,
        watched_dates: watchedDates,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (upsertError) {
        console.error("Error updating watched history in Supabase:", upsertError);
      } else {
        console.log(`Tracked video ${videoId} as watched in Supabase for user ${user.id}.`);
      }
    } catch (error) {
      console.error("Exception tracking watched video in Supabase:", error);
    }
  } else {
    try {
      let watchedHistory = JSON.parse(localStorage.getItem("watchedHistory") || "[]");
      if (!watchedHistory.includes(videoId)) {
        watchedHistory.push(videoId);
        localStorage.setItem("watchedHistory", JSON.stringify(watchedHistory));
      }
      let watchedDates = JSON.parse(localStorage.getItem("watchedDates") || "{}");
      watchedDates[videoId] = (/* @__PURE__ */ new Date()).toISOString();
      localStorage.setItem("watchedDates", JSON.stringify(watchedDates));
      console.log(`Tracked video ${videoId} as watched in localStorage.`);
    } catch (error) {
      console.error("Error tracking watched video in localStorage:", error);
    }
  }
}

// js/utils/videoUtils.js
function searchVideos(videos, query) {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm)
    return videos;
  return videos.filter((video) => {
    if (video.title && video.title.toLowerCase().includes(searchTerm))
      return true;
    if (video.tags && video.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
      return true;
    if (video.guides && video.guides.some((guide) => guide.toLowerCase().includes(searchTerm)))
      return true;
    return false;
  });
}
function applyFilters(videos, filters) {
  return videos.filter((video) => {
    if (filters.level && video.level !== filters.level)
      return false;
    if (filters.soundQuality && video.soundQuality !== filters.soundQuality)
      return false;
    if (filters.guide && video.guides && !video.guides.includes(filters.guide))
      return false;
    return true;
  });
}

// js/utils/dbUtils.js
var DB_NAME = "VideoBrowserDB";
var STORE_NAME = "videos";
var DB_VERSION = 1;
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "_id" });
      }
    };
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject("Error opening IndexedDB.");
    };
  });
}
async function saveVideosToDB(videos) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const clearRequest = store.clear();
    clearRequest.onsuccess = () => {
      videos.forEach((video) => {
        store.put(video);
      });
    };
    clearRequest.onerror = (event) => {
      console.error("Error clearing store:", event.target.error);
      reject("Error clearing store before saving new videos.");
    };
    transaction.oncomplete = () => {
      console.log("Videos saved to IndexedDB successfully.");
      resolve();
    };
    transaction.onerror = (event) => {
      console.error("Error saving videos to IndexedDB:", event.target.error);
      reject("Error saving videos to IndexedDB.");
    };
  });
}
async function getVideosFromDB() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = (event) => {
      if (event.target.result && event.target.result.length > 0) {
        resolve(event.target.result);
      } else {
        resolve(null);
      }
    };
    request.onerror = (event) => {
      console.error("Error fetching videos from IndexedDB:", event.target.error);
      reject("Error fetching videos from IndexedDB.");
    };
  });
}
async function exportAppState() {
  const db = await openDB();
  const videos = await new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME], "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
  const state = {
    videos,
    localStorage: {
      targetDifficulty: localStorage.getItem("targetDifficulty"),
      feedbackHistory: JSON.parse(localStorage.getItem("feedbackHistory") || "[]"),
      watchedHistory: JSON.parse(localStorage.getItem("watchedHistory") || "[]"),
      watchedDates: JSON.parse(localStorage.getItem("watchedDates") || "{}"),
      currentPage: localStorage.getItem("currentPage")
    }
  };
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "videobrowser_state.json";
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}
async function importAppState(file) {
  const text = await file.text();
  const state = JSON.parse(text);
  const ls = state.localStorage || {};
  if (ls.targetDifficulty !== void 0)
    localStorage.setItem("targetDifficulty", ls.targetDifficulty);
  if (ls.feedbackHistory)
    localStorage.setItem("feedbackHistory", JSON.stringify(ls.feedbackHistory));
  if (ls.watchedHistory)
    localStorage.setItem("watchedHistory", JSON.stringify(ls.watchedHistory));
  if (ls.watchedDates)
    localStorage.setItem("watchedDates", JSON.stringify(ls.watchedDates));
  if (ls.currentPage !== void 0)
    localStorage.setItem("currentPage", ls.currentPage);
  if (Array.isArray(state.videos)) {
    await saveVideosToDB(state.videos);
  }
}

// js/utils/supabaseVideos.js
async function fetchVideosFromSupabase() {
  try {
    const { data, error } = await supabase.from("videos").select("*");
    if (error) {
      console.error("Supabase fetch error:", error);
      return null;
    }
    return data || null;
  } catch (err) {
    console.error("Supabase fetch failed:", err);
    return null;
  }
}

// js/app.js
var allVideos = [];
var currentVideos = [];
var currentPage = 1;
var videosPerPage = 15;
var targetDifficulty = null;
var fileInput = document.getElementById("fileInput");
var videoListElement = document.getElementById("videoList");
var searchBar = document.getElementById("searchBar");
var levelFilterElement = document.getElementById("levelFilter");
var soundQualityFilterElement = document.getElementById("soundQualityFilter");
var guideFilterElement = document.getElementById("guideFilter");
var sortOptionsElement = document.getElementById("sortOptions");
var prevPageButton = document.getElementById("prevPage");
var nextPageButton = document.getElementById("nextPage");
var pageInfoElement = document.getElementById("pageInfo");
var muchEasierPageButton = document.getElementById("muchEasierPage");
var muchHarderPageButton = document.getElementById("muchHarderPage");
var clearFiltersButton = document.getElementById("clearFiltersButton");
var viewHistoryButton = document.getElementById("viewHistoryButton");
var exportStateButton = document.getElementById("exportStateButton");
var importStateButton = document.getElementById("importStateButton");
var importStateInput = document.getElementById("importStateInput");
var dataSourceIndicator = document.getElementById("dataSourceIndicator");
async function initializeApp() {
  currentPage = loadCurrentPage();
  initAuthUI();
  await checkUserSession();
  fileInput.addEventListener("change", handleFileSelect);
  searchBar.addEventListener("input", handleSearchAndFilter);
  levelFilterElement.addEventListener("change", handleSearchAndFilter);
  soundQualityFilterElement.addEventListener("change", handleSearchAndFilter);
  guideFilterElement.addEventListener("change", handleSearchAndFilter);
  videoListElement.addEventListener("tagClicked", (e) => {
    searchBar.value = e.detail;
    handleSearchAndFilter();
  });
  videoListElement.addEventListener("guideClicked", (e) => {
    guideFilterElement.value = e.detail;
    handleSearchAndFilter();
  });
  sortOptionsElement.addEventListener("change", handleSortChange);
  prevPageButton.addEventListener("click", () => changePage(currentPage - 1));
  nextPageButton.addEventListener("click", () => changePage(currentPage + 1));
  muchEasierPageButton.addEventListener("click", () => changePage(Math.max(1, currentPage - 5)));
  muchHarderPageButton.addEventListener("click", () => changePage(currentPage + 5));
  clearFiltersButton.addEventListener("click", clearAllFilters);
  viewHistoryButton.addEventListener("click", showViewHistoryPopup);
  exportStateButton.addEventListener("click", exportAppState);
  importStateButton.addEventListener("click", () => importStateInput.click());
  importStateInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
      await importAppState(file);
      window.location.reload();
    }
  });
  document.addEventListener("keydown", handleKeyboardShortcuts);
  let loaded = false;
  if (navigator.onLine && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
    const supaVideos = await fetchVideosFromSupabase();
    if (supaVideos) {
      const mappedVideos = supaVideos.map((v) => ({
        ...v,
        difficultyScore: v.difficulty_score ?? v.difficultyScore,
        sources: { youtube: v.youtube_id ?? v.sources?.youtube },
        hostingId: v.youtube_id ?? v.hostingId
      }));
      if (validateBasicStructure(mappedVideos)) {
        allVideos = mappedVideos;
        await saveVideosToDB(allVideos);
        dataSourceIndicator.textContent = "Supabase";
        loaded = true;
      }
    }
  }
  if (!loaded) {
    try {
      const dbVideos = await getVideosFromDB();
      if (dbVideos) {
        allVideos = dbVideos;
        if (validateBasicStructure(allVideos)) {
          console.log("Loaded data from IndexedDB");
          dataSourceIndicator.textContent = "IndexedDB";
          targetDifficulty = loadTargetDifficulty();
          if (targetDifficulty === null) {
            targetDifficulty = calculateInitialDifficulty(allVideos);
            saveTargetDifficulty(targetDifficulty);
          }
          loaded = true;
        } else {
          console.warn("Invalid data structure in IndexedDB. Please re-select file.");
        }
      } else {
        console.log("No data in IndexedDB. Please select a file.");
      }
    } catch (error) {
      console.error("Error loading data from IndexedDB:", error);
    }
  }
  if (loaded) {
    if (targetDifficulty === null) {
      targetDifficulty = calculateInitialDifficulty(allVideos);
      saveTargetDifficulty(targetDifficulty);
    }
    processAndDisplayVideos();
  }
}
function saveCurrentPage() {
  localStorage.setItem("currentPage", currentPage);
}
function updatePageInURL(page) {
  const url = new URL(window.location);
  url.searchParams.set("page", page);
  window.history.pushState({}, "", url);
}
function loadCurrentPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const pageFromURL = urlParams.get("page");
  if (pageFromURL) {
    return parseInt(pageFromURL, 10);
  }
  const savedPage = localStorage.getItem("currentPage");
  return savedPage ? parseInt(savedPage, 10) : 1;
}
async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    try {
      videoListElement.innerHTML = "<p>Loading videos...</p>";
      allVideos = await loadVideoData(file);
      await saveVideosToDB(allVideos);
      dataSourceIndicator.textContent = "Local file";
      targetDifficulty = loadTargetDifficulty();
      if (targetDifficulty === null || allVideos.length > 0) {
        targetDifficulty = calculateInitialDifficulty(allVideos);
        saveTargetDifficulty(targetDifficulty);
      }
      processAndDisplayVideos();
    } catch (error) {
      videoListElement.innerHTML = `<p>Error loading file: ${error.message}. Please select a valid JSON file.</p>`;
      console.error("File loading error:", error);
    }
  }
}
function processAndDisplayVideos() {
  if (allVideos.length === 0) {
    videoListElement.innerHTML = "<p>No videos found in the selected file.</p>";
    return;
  }
  populateGuideFilter();
  applyCurrentFiltersAndSort();
  renderVideoPage();
}
function populateGuideFilter() {
  if (!guideFilterElement)
    return;
  const guides = /* @__PURE__ */ new Set();
  allVideos.forEach((video) => {
    if (video.guides && Array.isArray(video.guides)) {
      video.guides.forEach((guide) => guides.add(guide));
    }
  });
  while (guideFilterElement.options.length > 1) {
    guideFilterElement.remove(1);
  }
  Array.from(guides).sort().forEach((guide) => {
    const option = document.createElement("option");
    option.value = guide;
    option.textContent = guide;
    guideFilterElement.appendChild(option);
  });
}
function handleSearchAndFilter() {
  currentPage = 1;
  applyCurrentFiltersAndSort();
  renderVideoPage();
  updateActiveFiltersDisplay();
}
function handleSortChange() {
  currentPage = 1;
  applyCurrentFiltersAndSort();
  renderVideoPage();
}
function applyCurrentFiltersAndSort() {
  let filtered = [...allVideos];
  const activeFiltersForDisplay = [];
  const searchTerm = searchBar.value;
  if (searchTerm) {
    filtered = searchVideos(filtered, searchTerm);
    activeFiltersForDisplay.push(`Search: "${searchTerm}"`);
  }
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
  sessionStorage.setItem("activeFiltersForDisplay", JSON.stringify(activeFiltersForDisplay));
  const sortBy = sortOptionsElement.value;
  switch (sortBy) {
    case "publishedAt":
      filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      break;
    case "duration":
      filtered.sort((a, b) => a.duration - b.duration);
      break;
    case "title":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "difficultyScore":
    default:
      filtered.sort((a, b) => {
        const diffA = Math.abs(a.difficultyScore - targetDifficulty);
        const diffB = Math.abs(b.difficultyScore - targetDifficulty);
        if (diffA === diffB) {
          return a.difficultyScore - b.difficultyScore;
        }
        return diffA - diffB;
      });
      break;
  }
  currentVideos = filtered;
}
function renderVideoPage() {
  videoListElement.innerHTML = "";
  const watchedHistory = JSON.parse(localStorage.getItem("watchedHistory") || "[]");
  if (currentVideos.length === 0) {
    videoListElement.innerHTML = "<p>No videos match your current filters.</p>";
    updatePaginationControls(0);
    return;
  }
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const videosToDisplay = currentVideos.slice(startIndex, endIndex);
  videosToDisplay.forEach((video) => {
    const isWatched = watchedHistory.includes(video._id);
    const videoCard = createVideoCard(video, handleWatchVideo, handleTooEasy, handleTooHard, handleRightLevel, isWatched);
    videoListElement.appendChild(videoCard);
  });
  updatePaginationControls(currentVideos.length);
}
function updatePaginationControls(totalVideos) {
  const totalPages = Math.ceil(totalVideos / videosPerPage);
  pageInfoElement.textContent = `Page ${currentPage} of ${totalPages > 0 ? totalPages : 1}`;
  prevPageButton.textContent = "Easier";
  nextPageButton.textContent = "Harder";
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages || totalPages === 0;
  muchEasierPageButton.disabled = currentPage <= 1;
  muchHarderPageButton.disabled = currentPage >= totalPages - 4;
}
function changePage(newPage) {
  const totalPages = Math.ceil(currentVideos.length / videosPerPage);
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    saveCurrentPage();
    updatePageInURL(currentPage);
    renderVideoPage();
  }
}
async function handleWatchVideo(video) {
  openYouTubeVideo(video.sources.youtube || video.hostingId);
  await trackWatchedVideo(video._id);
  renderVideoPage();
}
function handleTooEasy(video) {
  console.log(`Video "${video.title}" marked as Too Easy. Current target: ${targetDifficulty}`);
  targetDifficulty = recordFeedback(video._id, video.difficultyScore, "tooEasy", targetDifficulty);
  console.log(`New target difficulty: ${targetDifficulty}`);
  applyCurrentFiltersAndSort();
  renderVideoPage();
}
function handleTooHard(video) {
  console.log(`Video "${video.title}" marked as Too Hard. Current target: ${targetDifficulty}`);
  targetDifficulty = recordFeedback(video._id, video.difficultyScore, "tooHard", targetDifficulty);
  console.log(`New target difficulty: ${targetDifficulty}`);
  applyCurrentFiltersAndSort();
  renderVideoPage();
}
function handleRightLevel(video) {
  console.log(`Video "${video.title}" marked as Right Level. Current target: ${targetDifficulty}`);
  targetDifficulty = recordFeedback(video._id, video.difficultyScore, "rightLevel", targetDifficulty);
  console.log(`New target difficulty: ${targetDifficulty}`);
  applyCurrentFiltersAndSort();
  renderVideoPage();
}
function clearAllFilters() {
  searchBar.value = "";
  levelFilterElement.value = "";
  soundQualityFilterElement.value = "";
  guideFilterElement.value = "";
  handleSearchAndFilter();
}
function updateActiveFiltersDisplay() {
  const activeFiltersDisplayElement = document.getElementById("activeFiltersDisplay");
  if (!activeFiltersDisplayElement)
    return;
  const activeFiltersForDisplay = JSON.parse(sessionStorage.getItem("activeFiltersForDisplay") || "[]");
  if (activeFiltersForDisplay.length > 0) {
    activeFiltersDisplayElement.innerHTML = `Active filters: ${activeFiltersForDisplay.map((f) => `<span class="filter-chip">${f}</span>`).join(" ")}`;
  } else {
    activeFiltersDisplayElement.innerHTML = "";
  }
}
function handleKeyboardShortcuts(event) {
  if (event.key === "/") {
    if (document.activeElement !== searchBar) {
      event.preventDefault();
      searchBar.focus();
    }
  }
}
function showViewHistoryPopup() {
  const watchedHistory = JSON.parse(localStorage.getItem("watchedHistory") || "[]");
  const watchedDates = JSON.parse(localStorage.getItem("watchedDates") || "{}");
  const popupContainer = document.createElement("div");
  popupContainer.id = "viewHistoryPopup";
  popupContainer.className = "popup-container";
  const popupContent = document.createElement("div");
  popupContent.className = "popup-content";
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.className = "close-button";
  closeButton.addEventListener("click", () => popupContainer.remove());
  popupContent.appendChild(closeButton);
  const title = document.createElement("h2");
  title.textContent = "View History";
  popupContent.appendChild(title);
  if (watchedHistory.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No videos have been watched yet.";
    popupContent.appendChild(emptyMessage);
  } else {
    const sortedWatchedVideos = watchedHistory.sort((a, b) => new Date(watchedDates[b]) - new Date(watchedDates[a]));
    const videoCardsFragment = document.createDocumentFragment();
    sortedWatchedVideos.forEach((videoId) => {
      const video = allVideos.find((v) => v._id === videoId);
      if (video) {
        const isWatched = true;
        const videoCard = createVideoCard(video, handleWatchVideo, handleTooEasy, handleTooHard, handleRightLevel, isWatched);
        const dateElement = document.createElement("p");
        dateElement.textContent = `Viewed on: ${new Date(watchedDates[videoId]).toLocaleString()}`;
        videoCard.appendChild(dateElement);
        videoCardsFragment.appendChild(videoCard);
      }
    });
    popupContent.appendChild(videoCardsFragment);
  }
  popupContainer.appendChild(popupContent);
  document.body.appendChild(popupContainer);
}
initializeApp();
//# sourceMappingURL=bundle.js.map
