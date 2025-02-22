let currentVideoId = null;

function getCurrentTimestamp() {
  const video = document.querySelector('video');
  if (video) {
    const currentTime = Math.floor(video.currentTime);
    console.log(`Current timestamp: ${currentTime}s`); // Debug log
    return currentTime;
  }
  console.warn("No video element found."); // Debug log
  return null;
}

function saveTimestamp() {
  const timestamp = getCurrentTimestamp();
  if (timestamp !== null) {
    chrome.storage.sync.get(['timestamps'], (result) => {
      const timestamps = result.timestamps || [];
      const videoId = new URL(window.location.href).searchParams.get('v');
      console.log(`Video ID: ${videoId}`); // Debug log

      if (videoId) {
        if (!timestamps.some(ts => ts.videoId === videoId && ts.time === timestamp)) {
          timestamps.push({ videoId, time: timestamp });
          chrome.storage.sync.set({ timestamps }, () => {
            console.log(`Saved timestamp: ${timestamp}s for video ID: ${videoId}`); // Debug log
          });
        } else {
          console.log(`Timestamp ${timestamp}s for video ID: ${videoId} already exists.`); // Debug log
        }
      } else {
        console.warn("No video ID found in the URL."); // Debug log
      }
    });
  } else {
    console.warn("Timestamp is null, not saving."); // Debug log
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveTimestamp") {
    saveTimestamp();
    sendResponse({ status: "success" });
  }
});