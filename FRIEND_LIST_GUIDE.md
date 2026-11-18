# Friend List - Pagination Guide ✳

## Overview

The "Find your people" section now displays a clean, organized friend list with pagination support.

## Features

### 1. **Table Display**
- **Columns**: NAME | CONTACT
- Shows only essential information (name and contact number)
- Alphabetically sorted by name

### 2. **Pagination System**
- **10 friends per page** (customizable in code if needed)
- Previous/Next navigation buttons
- Current page indicator (e.g., "Page 1 of 2")
- Buttons automatically disable on first/last page

### 3. **Search Functionality**
- Search by friend name
- Results automatically reset to Page 1
- Shows count of matching results

### 4. **Sample Friends Data**
Default friends (in alphabetical order):
1. Jyoti
2. Nandini
3. Nandini Jal
4. Niladri
5. Parbati
6. Priti
7. Rukmini
8. Sasmita
9. Tapa

## How It Works

### Demo Mode
When no API is connected, the page loads sample data with the 9 friends listed above.

### With Google Sheets API
When connected to Google Sheets, the app will:
1. Fetch all friends from the data source
2. Sort them alphabetically
3. Display 10 per page with pagination

### Customization

**To change items per page:**
Edit `assets/js/app.js` line:
```javascript
const itemsPerPage = 10;  // Change this number
```

**To add/update friend data:**
In demo mode: Edit the `defaultFriends` array in `getDemoData()` function
With API: Update your Google Sheets data

## Example Usage

```
Page 1 (Friends 1-10)
---
Jyoti          +91 XXX-XXX-XXXX
Nandini        +91 XXX-XXX-XXXX
Nandini Jal    +91 XXX-XXX-XXXX
Niladri        +91 XXX-XXX-XXXX
Parbati        +91 XXX-XXX-XXXX
Priti          +91 XXX-XXX-XXXX
Rukmini        +91 XXX-XXX-XXXX
Sasmita        +91 XXX-XXX-XXXX
Tapa           +91 XXX-XXX-XXXX

[← Previous] Page 1 of 1 [Next →]
              (Next button would be disabled)
```

## Technical Details

### File Changes
- **index.html**: Updated table structure with 2 columns (NAME, CONTACT)
- **assets/css/style.css**: Added `.pagination-controls` and `.pagination-btn` styles
- **assets/js/app.js**: 
  - Added `currentPage` and `itemsPerPage` variables
  - Updated `renderTable()` function with pagination logic
  - Added event listeners for pagination buttons

### Browser Storage
- Demo data stored in browser localStorage with key: `backbench-club-demo-v1`
- Keeps user's friend preference data between sessions

## Styling

Pagination buttons have:
- Clear visible labels (← Previous, Next →)
- Hover effects (inverse colors)
- Disabled state styling (reduced opacity)
- Responsive design for mobile devices

## Notes

✓ Names are displayed in alphabetical order
✓ Each page shows exactly 10 friends
✓ Search functionality works across all pages
✓ Pagination resets when searching
✓ Contact placeholders can be replaced with real numbers
✓ Fully responsive on mobile devices
