// Content script for TUF Striver Sheet GFG Links
console.log("TUF Striver Sheet GFG Links loaded on:", window.location.href);

// Check if GFG links are enabled
function isGFGLinksEnabled() {
  return localStorage.getItem("gfg_links_enabled") !== "false";
}

// Initialize the extension
function initializeExtension() {
  // Only proceed if GFG links are enabled
  if (!isGFGLinksEnabled()) {
    console.log("GFG Links are disabled");
    return;
  }

  // Add GFG icons to tables after a short delay to ensure page is loaded
  setTimeout(() => {
    loadOrProcessGFGIcons();
  }, 1000);
}

// Function to load cached GFG icons or process tables if cache is empty
function loadOrProcessGFGIcons() {
  // Double-check if still enabled
  if (!isGFGLinksEnabled()) {
    console.log("GFG Links disabled, skipping processing");
    return;
  }

  const currentUrl = window.location.href;
  const cacheKey = `gfg_cache_${btoa(currentUrl).slice(0, 20)}`; // Create unique key for this page

  console.log("Checking cache for:", cacheKey);

  // Try to load from cache first
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      const cacheAge = Date.now() - parsed.timestamp;
      const cacheValidHours = 24; // Cache for 24 hours

      if (cacheAge < cacheValidHours * 60 * 60 * 1000) {
        console.log("Loading GFG icons from cache...");
        loadGFGIconsFromCache(parsed.data);
        return;
      } else {
        console.log("Cache expired, processing fresh...");
        localStorage.removeItem(cacheKey);
      }
    } catch (e) {
      console.log("Cache corrupted, processing fresh...");
      localStorage.removeItem(cacheKey);
    }
  }

  // If no valid cache, process tables and save to cache
  console.log("No valid cache found, processing tables...");
  const processedData = addGFGIcons();

  if (processedData.length > 0) {
    const cacheData = {
      timestamp: Date.now(),
      url: currentUrl,
      data: processedData,
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log(`Cached ${processedData.length} GFG icons`);
    } catch (e) {
      console.log("Failed to save to cache:", e);
    }
  }
}

// Function to load GFG icons from cached data
function loadGFGIconsFromCache(cachedData) {
  let restoredCount = 0;

  cachedData.forEach((item) => {
    // Find the cell using the stored selector path
    const cell = findCellByPath(item.cellPath);
    if (cell && cell.textContent.trim() === item.questionText) {
      // Only add if icon doesn't already exist
      if (!cell.querySelector(".gfg-icon")) {
        addGFGIconToCell(cell, item.questionText);
        restoredCount++;
      }
    }
  });

  console.log(`Restored ${restoredCount} GFG icons from cache`);
}

// Function to create a unique path to identify a cell
function getCellPath(cell) {
  const path = [];
  let current = cell;

  while (current && current !== document.body) {
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(current);
      path.unshift({
        tag: current.tagName.toLowerCase(),
        index: index,
        className: current.className || "",
      });
    }
    current = parent;
  }

  return path;
}

// Function to find a cell using the stored path
function findCellByPath(cellPath) {
  let current = document.body;

  for (const step of cellPath) {
    const children = Array.from(current.children);
    const target = children.find(
      (child, index) =>
        child.tagName.toLowerCase() === step.tag &&
        index === step.index &&
        child.className === step.className
    );

    if (!target) {
      return null;
    }
    current = target;
  }

  return current;
}

// Function to add GFG icons to all tables (returns data for caching)
function addGFGIcons() {
  console.log("Looking for tables...");

  const processedData = [];

  // Find all tables on the page
  const tables = document.querySelectorAll("table");
  console.log(`Found ${tables.length} table(s)`);

  tables.forEach((table, tableIndex) => {
    console.log(`Processing table ${tableIndex + 1}`);

    // Get all rows in the table
    const rows = table.querySelectorAll("tr");

    rows.forEach((row, rowIndex) => {
      // Skip header row (first row)
      if (rowIndex === 0) return;

      // Get all cells in the row
      const cells = row.querySelectorAll("td, th");

      // Check if there's a second column (index 1)
      if (cells.length >= 2) {
        const secondCell = cells[1];
        const questionText = secondCell.textContent.trim();

        // Skip if the cell is empty or too short
        if (questionText && questionText.length > 3) {
          console.log(`Found question: ${questionText}`);
          addGFGIconToCell(secondCell, questionText);

          // Store data for caching
          processedData.push({
            questionText: questionText,
            cellPath: getCellPath(secondCell),
            tableIndex: tableIndex,
            rowIndex: rowIndex,
          });
        }
      }
    });
  });

  return processedData;
}

// Function to add GFG icon to a specific cell
function addGFGIconToCell(cell, questionText) {
  // Check if icon already exists
  if (cell.querySelector(".gfg-icon")) {
    return;
  }

  // Create the GFG icon/button
  const gfgIcon = document.createElement("span");
  gfgIcon.className = "gfg-icon";
  gfgIcon.innerHTML = "🔗 GFG";
  gfgIcon.title = "Open on GeeksforGeeks";
  gfgIcon.style.cssText = `
    margin-left: 8px;
    padding: 2px 6px;
    background: #0f9d58;
    color: white;
    border-radius: 3px;
    font-size: 10px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    font-weight: bold;
    transition: background-color 0.3s;
  `;

  // Add hover effect
  gfgIcon.addEventListener("mouseenter", () => {
    gfgIcon.style.backgroundColor = "#0d8043";
  });

  gfgIcon.addEventListener("mouseleave", () => {
    gfgIcon.style.backgroundColor = "#0f9d58";
  });

  // Add click handler to search directly on GeeksforGeeks
  gfgIcon.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Clean the question text for better search results
    const cleanedQuestionText = cleanQuestionText(questionText);

    // Construct direct GeeksforGeeks search URL
    const gfgSearchUrl = `https://www.geeksforgeeks.org/search/${encodeURIComponent(
      cleanedQuestionText
    )}/`;

    console.log(`Opening GFG search for: ${cleanedQuestionText}`);
    console.log(`URL: ${gfgSearchUrl}`);

    // Open in new tab
    window.open(gfgSearchUrl, "_blank");
  });

  // Add the icon to the cell
  cell.appendChild(gfgIcon);
}

// Function to clean question text for better search results
function cleanQuestionText(questionText) {
  // Remove common prefixes and suffixes
  let cleaned = questionText
    .replace(/^\d+\.\s*/, "") // Remove leading numbers like "1. "
    .replace(/\s*\(.*?\)\s*/g, " ") // Remove content in parentheses
    .replace(/\s*\[.*?\]\s*/g, " ") // Remove content in square brackets
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();

  // If the cleaned text is too short, use original
  if (cleaned.length < 3) {
    cleaned = questionText;
  }

  console.log(`Original: "${questionText}" -> Cleaned: "${cleaned}"`);
  return cleaned + " practice";
}

// Function to clear cache (useful for debugging)
function clearGFGCache() {
  const keys = Object.keys(localStorage);
  const cacheKeys = keys.filter((key) => key.startsWith("gfg_cache_"));

  cacheKeys.forEach((key) => {
    localStorage.removeItem(key);
  });

  console.log(`Cleared ${cacheKeys.length} cache entries`);
}

// Expose cache clearing function globally for debugging
window.clearGFGCache = clearGFGCache;

// Expose main function globally for popup communication
window.loadOrProcessGFGIcons = loadOrProcessGFGIcons;

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeExtension);
} else {
  initializeExtension();
}

// Handle dynamic content loading (in case tables are loaded dynamically)
const observer = new MutationObserver((mutations) => {
  // Only observe if GFG links are enabled
  if (!isGFGLinksEnabled()) {
    return;
  }

  let shouldReprocess = false;

  mutations.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      // Check if any new tables were added
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === "TABLE" || node.querySelector("table")) {
            shouldReprocess = true;
          }
        }
      });
    }
  });

  if (shouldReprocess) {
    console.log("New tables detected, clearing cache and reprocessing...");
    clearGFGCache();
    setTimeout(loadOrProcessGFGIcons, 500);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
