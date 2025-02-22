chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ bookmarks: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveBookmark") {
    chrome.storage.local.get("bookmarks", (data) => {
      const bookmarks = data.bookmarks;
      bookmarks.push(request.timestamp);
      chrome.storage.local.set({ bookmarks: bookmarks });
      sendResponse({ success: true });
    });
    return true; // Keep the message channel open for sendResponse
  }
});
