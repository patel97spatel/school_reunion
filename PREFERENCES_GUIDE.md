# Veg/Non-Veg Preferences Feature Guide

## 📋 Overview

Your reunion website now includes an interactive **Dietary Preferences System** that allows friends to register their veg/non-veg preferences. The system automatically:
- ✅ Tracks preferences for all 37 friends
- ✅ Displays names in alphabetical order
- ✅ Shows live counts of veg and non-veg selections
- ✅ Maintains a sortable, filterable preferences table
- ✅ Saves all data locally in browser storage

---

## 👥 Friends List (37 Total)

### From the image you provided (28 friends):
1. Akash
2. Anil
3. Aloka
4. Biku
5. Biki
6. Bikash
7. Biren
8. Bulu
9. Debashish (1)
10. Debashish (2)
11. Deepak
12. Dilip
13. Dola
14. Dharmananda
15. Ghana
16. Hemanta
17. Jenamani
18. Kunta
19. Madan
20. Naren
21. Nirmala
22. Parkhita
23. Rohita
24. Sashika
25. Sunil Kharsel
26. Sujit
27. Tilu

### Additional friends:
28. Jyoti
29. Nandini
30. Nandini Jal
31. Niladri
32. Parbati
33. Priti
34. Rukmini
35. Sasmita
36. Tapa

**All names are automatically sorted alphabetically.**

---

## 🎯 How It Works

### 1. **Selection Form**
Navigate to the "Preferences" section in the navigation menu.

**Steps:**
1. Click "Select your name" dropdown
2. Choose your name from the alphabetically-sorted list
3. Click either 🥗 **Vegetarian** or 🍗 **Non-Vegetarian**
4. Click "Submit Preference"
5. Your selection is instantly saved

### 2. **Live Statistics**
Three cards display real-time counts:
- 🥗 **Vegetarian** count
- 🍗 **Non-Vegetarian** count
- **Total Responses** count

Updates immediately after each submission.

### 3. **Friends Table**
Below the form, a sortable table shows:
- **Friend Name** (alphabetically sorted)
- **Preference Status** (color-coded):
  - 🥗 Green: Vegetarian
  - 🍗 Orange: Non-Vegetarian
  - ⏳ Gray: Not Selected

### 4. **Filter Options**
Four buttons let you view:
- **All Friends** — Shows all 37 friends
- **🥗 Vegetarian** — Only vegetarian selections
- **🍗 Non-Vegetarian** — Only non-vegetarian selections
- **⏳ Not Selected** — Friends who haven't chosen yet

---

## 💾 Data Storage

All preferences are saved in the **browser's local storage**:
- Stored locally (not sent to any server)
- Persists even after closing/reopening the page
- Each browser has its own independent data
- Clear browser data to reset all preferences

**Storage Key:** `reunion-preferences-v1`

---

## 📊 Data Structure

Each preference is stored as:
```json
{
  "friendId": {
    "name": "Friend Name",
    "preference": "veg" or "nonveg",
    "timestamp": "2026-11-18T21:30:00.000Z"
  }
}
```

---

## 🎨 Visual Design

- **Green color (#e8f3d8)** — Vegetarian selections
- **Orange color (#f0d9c8)** — Non-vegetarian selections
- **Gray color (#f0f0e8)** — Pending selections
- **Lime accent** — Action buttons and highlights

---

## 🔧 Technical Details

### Files Modified/Created:

1. **[assets/js/friends.js](../assets/js/friends.js)** — New
   - Master list of 37 friends
   - Sorted alphabetically at load time
   - ID-based friend mapping

2. **[index.html](../index.html)** — Updated
   - Added preferences section with forms
   - New navigation link "Preferences"
   - Filter buttons and display table

3. **[assets/css/style.css](../assets/css/style.css)** — Updated
   - Styled preference form elements
   - Color-coded status badges
   - Responsive design for all screen sizes

4. **[assets/js/app.js](../assets/js/app.js)** — Updated
   - `initializePreferences()` — Sets up the form
   - `savePreference()` — Saves to localStorage
   - `getPreferences()` — Retrieves saved data
   - `renderPreferencesTable()` — Displays friends table
   - `updatePreferencesCounts()` — Updates stat cards

### Functions:

| Function | Purpose |
|----------|---------|
| `initializePreferences()` | Initialize form, dropdowns, and event listeners |
| `savePreference(id, name, pref)` | Save a friend's preference to localStorage |
| `getPreferences()` | Retrieve all saved preferences |
| `renderPreferencesTable(filter)` | Display sorted, filtered friends table |
| `updatePreferencesCounts()` | Update veg/non-veg/total counts |

---

## ✨ Features

✅ **Alphabetical Sorting** — All names sorted A-Z  
✅ **Real-time Updates** — Counts update immediately  
✅ **Filtering** — View by all/veg/non-veg/pending  
✅ **Local Storage** — Data saved in browser  
✅ **Responsive Design** — Works on mobile, tablet, desktop  
✅ **Duplicate Prevention** — Re-selecting updates the choice  
✅ **Color Coding** — Visual preference indicators  
✅ **User Feedback** — Confirmation messages on save  

---

## 📱 Mobile & Desktop

The preferences section is fully responsive:
- **Desktop:** 3-column summary cards, full-width table
- **Tablet:** Stacked layout with side-by-side buttons
- **Mobile:** Single-column, touch-friendly buttons

---

## 🚀 Next Steps

1. ✅ Commit changes to GitHub
2. ✅ Push to trigger deployment
3. ✅ Share the "Preferences" link with friends
4. ✅ Monitor counts in real-time
5. ✅ Export data via browser dev tools if needed

---

## 📤 Exporting Data

To export preferences as JSON:

1. Open browser DevTools (`F12`)
2. Open Console tab
3. Run:
```javascript
copy(JSON.stringify(JSON.parse(localStorage.getItem('reunion-preferences-v1')), null, 2))
```
4. Paste into any text editor and save as `.json`

---

## ❓ FAQ

**Q: How many friends are in the system?**
A: 37 friends total (28 from your image + 9 additional)

**Q: Can I change a friend's preference later?**
A: Yes! Simply select the same name again and choose a different option. It will update.

**Q: Does my data go to a server?**
A: No. All data is stored locally in your browser only.

**Q: Can I delete a preference?**
A: Clear your browser's local storage, or manually edit via DevTools console.

**Q: Are names really alphabetical?**
A: Yes! All 37 names are sorted A-Z, both in the dropdown and in the table.

**Q: What if two friends have the same name?**
A: They're shown as "Name (number)" to distinguish them (e.g., "Debashish (1)", "Debashish (2)").

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Data disappeared | Your browser cleared local storage. Preferences aren't saved on a server. |
| Friend name not in list | Check the full list above. If missing, ask organizer to add them to friends.js |
| Counts not updating | Refresh the page, or check browser console for errors |
| Dropdown not working | Ensure JavaScript is enabled and friends.js is loading |

---

**Happy reunion planning! 🎉**
