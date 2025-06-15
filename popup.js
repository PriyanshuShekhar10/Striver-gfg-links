// Popup script for GFG Links toggle

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("gfg-toggle");
  const status = document.getElementById("status");
  const container = document.querySelector(".container");

  // Add loading state initially
  container.classList.add("loading");

  // Load current state
  loadToggleState();

  // Add click listener to toggle
  toggle.addEventListener("click", function () {
    if (toggle.classList.contains("disabled")) return;

    const isEnabled = toggle.classList.contains("active");
    const newState = !isEnabled;

    // Add loading state
    container.classList.add("loading");

    // Update UI with animation
    setTimeout(() => {
      updateToggleUI(newState);

      // Save state
      saveToggleState(newState);

      // Notify content script and reload page
      notifyContentScript(newState);

      // Remove loading state
      setTimeout(() => {
        container.classList.remove("loading");
      }, 300);
    }, 150);
  });
});

function loadToggleState() {
  const toggle = document.getElementById("gfg-toggle");
  const status = document.getElementById("status");
  const container = document.querySelector(".container");

  // Get saved state (default is enabled)
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];

    if (currentTab.url.includes("takeuforward.org")) {
      // Execute script to get the current state from content script
      chrome.scripting
        .executeScript({
          target: { tabId: currentTab.id },
          func: () => {
            return localStorage.getItem("gfg_links_enabled") !== "false";
          },
        })
        .then((results) => {
          const isEnabled =
            results && results[0] && results[0].result !== false;
          updateToggleUI(isEnabled);

          // Remove loading state
          setTimeout(() => {
            container.classList.remove("loading");
          }, 500);
        })
        .catch((error) => {
          console.error("Error loading toggle state:", error);
          updateToggleUI(true); // Default to enabled
          setTimeout(() => {
            container.classList.remove("loading");
          }, 500);
        });
    } else {
      updateToggleUI(false, true); // disabled state for unsupported sites

      // Remove loading state
      setTimeout(() => {
        container.classList.remove("loading");
      }, 500);
    }
  });
}

function updateToggleUI(isEnabled, isUnsupported = false) {
  const toggle = document.getElementById("gfg-toggle");
  const status = document.getElementById("status");

  // Remove existing state classes
  toggle.classList.remove("active", "disabled");
  status.classList.remove("enabled", "disabled");

  if (isUnsupported) {
    toggle.classList.add("disabled");
    status.textContent = "❌ Not on supported site";
    status.classList.add("disabled");
    return;
  }

  if (isEnabled) {
    toggle.classList.add("active");
    status.textContent = "✅ GFG Links Enabled";
    status.classList.add("enabled");
  } else {
    status.textContent = "❌ GFG Links Disabled";
    status.classList.add("disabled");
  }
}

function saveToggleState(isEnabled) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabs[0].id },
        func: (enabled) => {
          localStorage.setItem("gfg_links_enabled", enabled.toString());
        },
        args: [isEnabled],
      })
      .catch((error) => {
        console.error("Error saving toggle state:", error);
      });
  });
}

function notifyContentScript(isEnabled) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabs[0].id },
        func: (enabled) => {
          // Clear all existing GFG icons with animation
          document.querySelectorAll(".gfg-icon").forEach((icon) => {
            icon.style.opacity = "0";
            icon.style.transform = "scale(0.8)";
            setTimeout(() => icon.remove(), 200);
          });

          // Clear cache
          if (typeof clearGFGCache === "function") {
            clearGFGCache();
          }

          // Reload icons if enabled
          if (enabled) {
            setTimeout(() => {
              if (typeof loadOrProcessGFGIcons === "function") {
                loadOrProcessGFGIcons();
              }
            }, 300);
          }
        },
        args: [isEnabled],
      })
      .catch((error) => {
        console.error("Error notifying content script:", error);
      });
  });
}
