document.addEventListener("DOMContentLoaded", () => {
  const timestampList = document.getElementById("timestampList");
  const clearAllButton = document.getElementById("clearAll");

  function loadTimestamps() {
    chrome.storage.sync.get(["timestamps"], (result) => {
      const timestamps = result.timestamps || [];
      timestampList.innerHTML = "";
      timestamps.forEach(({ videoId, time }) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Video ID: ${videoId}, Timestamp: ${time}s`;
        listItem.addEventListener("click", () => {
          chrome.tabs.create({
            url: `https://www.youtube.com/watch?v=${videoId}&t=${time}`,
          });
        });
        timestampList.appendChild(listItem);
      });
    });
  }

  clearAllButton.addEventListener("click", () => {
    chrome.storage.sync.set({ timestamps: [] }, loadTimestamps);
  });

  loadTimestamps();
});
