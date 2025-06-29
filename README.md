# TUF Striver Sheet GFG Links - Chrome Extension

A Chrome extension that adds "Open on GFG" links to problem tables on TakeUForward (TUF) Striver's DSA sheets and interview preparation pages.

## Screenshots

### Extension in Action

![GFG Links on Striver Sheet](assets/screenshot1.png)
_Green "🔗 GFG" buttons automatically appear next to each question name in the tables_

### Beautiful Toggle Popup

![Extension Popup Interface](assets/screenshot2.png)
_Modern, aesthetic popup with smooth toggle control to enable/disable GFG links_

## Features

- **Site Detection**: Only activates on supported TakeUForward pages
- **GFG Links**: Automatically adds "🔗 GFG" buttons next to question names in tables
- **Direct GFG Search**: Clicking a GFG button opens GeeksforGeeks search directly for that problem

## How It Works

1. **Finds all tables** on the supported pages
2. **Identifies question names** in the second column of each table
3. **Adds green "🔗 GFG" buttons** next to each question name
4. **Opens GeeksforGeeks search** when clicked, searching directly on the GFG website

## Supported Pages

This extension works exclusively on the following TakeUForward pages:

1. [Striver's A2Z DSA Course Sheet](https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2)
2. [Striver's SDE Sheet - Top Coding Interview Problems](https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems)
3. [Striver's 79 Last Moment DSA Sheet](https://takeuforward.org/interview-sheets/strivers-79-last-moment-dsa-sheet-ace-interviews)
4. [Blind 75 LeetCode Problems](https://takeuforward.org/interviews/blind-75-leetcode-problems-detailed-video-solutions)

## Installation

### Load as Unpacked Extension (Developer Mode)

1. **Download/Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top-right corner
4. **Click "Load unpacked"** and select the folder containing this extension

## How to Use

1. **Visit any supported TakeUForward page** (see list above)
2. **Look for tables** with question names - you'll see green "🔗 GFG" buttons appear next to each question
3. **Click any GFG button** to open GeeksforGeeks search directly for that problem
4. **Find your problem** in the GFG search results

## Privacy

This extension:

- Only works on specified TakeUForward pages
- Stores data locally in your browser
- Opens GeeksforGeeks searches in new tabs
- Does not track your browsing outside of the specified pages

## Contributing

Feel free to submit issues or pull requests to improve this extension!

## License

This project is open source and available under the MIT License.
