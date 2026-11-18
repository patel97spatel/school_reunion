# System Architecture - Veg/Non-Veg Preferences

## 🏗️ How It All Works Together

```
┌─────────────────────────────────────────────────────────────┐
│                   REUNION WEBSITE                            │
│              (index.html + assets/)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌─────────┐    ┌────────┐    ┌──────────┐
   │HTML     │    │ CSS    │    │JavaScript│
   │         │    │        │    │          │
   │• Form  │    │• Design│    │• Logic   │
   │• Table │    │• Colors│    │• Storage │
   │• Counts│    │• Layout│    │• Events  │
   └────┬────┘    └────────┘    └────┬─────┘
        │                            │
        └────────────────┬───────────┘
                         │
        ┌────────────────┴────────────────┐
        │   friends.js (37 Friends List) │
        └────────────────┬────────────────┘
                         │
     ┌───────────────────┴───────────────────┐
     │                                       │
     ▼                                       ▼
┌──────────────────┐              ┌─────────────────────┐
│  User Selects:   │              │  Browser Storage    │
│                  │              │  (localStorage)     │
│ 1. Name dropdown │──────────────│                     │
│ 2. Veg/Non-veg   │  SAVE DATA   │ reunion-pref-v1     │
│ 3. Submit button │──────────────│ {                   │
│                  │              │   "1": {            │
└──────────────────┘              │     "name": "...",  │
                                  │     "pref": "veg"   │
                                  │   }                 │
                                  │ }                   │
                                  └──────────┬──────────┘
                                             │
                                  LOAD DATA  │
                                             ▼
                                        ┌────────────┐
                                        │ Display:   │
                                        │ • Counts   │
                                        │ • Table    │
                                        │ • Filters  │
                                        └────────────┘
```

---

## 📱 User Flow

```
START
  │
  ├─► Open Preferences Section
  │
  ├─► Dropdown Menu
  │   └─► Select Name (sorted A-Z)
  │
  ├─► Choose Preference
  │   ├─► 🥗 Vegetarian
  │   └─► 🍗 Non-Vegetarian
  │
  ├─► Click Submit
  │   └─► ✓ Saved!
  │
  ├─► Counts Update
  │   ├─► Vegetarian +1
  │   ├─► Non-Veg +1
  │   └─► Total +1
  │
  ├─► Table Updates
  │   ├─► Friend appears in row
  │   ├─► Color coded badge shows
  │   └─► Alphabetical order maintained
  │
  └─► Success! Data persists
      (even after refresh)
```

---

## 🗂️ File Organization

```
school-reunion/
│
├── index.html .......................... Main page (UPDATED)
│   ├── Preferences section (NEW)
│   ├── Form with dropdown
│   ├── Statistics cards
│   └── Sortable, filterable table
│
├── assets/
│   │
│   ├── js/
│   │   ├── config.js .................. Settings
│   │   ├── friends.js ................. Friends list (NEW)
│   │   │   └── 37 friends with IDs
│   │   │       (auto-sorted A-Z)
│   │   │
│   │   └── app.js ..................... Main logic (UPDATED)
│   │       ├── initializePreferences()
│   │       ├── savePreference()
│   │       ├── getPreferences()
│   │       ├── renderPreferencesTable()
│   │       └── updatePreferencesCounts()
│   │
│   └── css/
│       └── style.css .................. Styling (UPDATED)
│           └── 50+ new rules for
│               preferences section
│
├── PREFERENCES_GUIDE.md ............... Full documentation
├── PREFERENCES_QUICK_REF.md ........... Quick reference
└── SETUP_SUMMARY.md ................... This summary
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────┐
│  Friend Visits  │
│  Preferences    │
└────────┬────────┘
         │
         ▼
   ┌──────────────┐
   │ Load Friends │ ◄─── friends.js (37 names, alphabetical)
   │ from Array   │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Load Saved   │ ◄─── localStorage (previous selections)
   │ Preferences  │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Populate     │
   │ Dropdown +   │
   │ Table        │
   └──────┬───────┘
          │
          ▼
   ┌──────────────────────┐
   │ User Interacts       │
   │ - Selects name       │
   │ - Chooses veg/nonveg │
   │ - Clicks submit      │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────┐
   │ Save to Local    │ ──► localStorage.setItem()
   │ Storage          │
   └──────┬───────────┘
          │
          ▼
   ┌──────────────────┐
   │ Update Display   │
   │ - Refresh counts │
   │ - Re-render table│
   │ - Animate update │
   └──────┬───────────┘
          │
          ▼
   ┌──────────────────┐
   │ Show Success     │
   │ Message          │
   └────────┬─────────┘
            │
            └──► Ready for next submission
```

---

## 🎨 Component Architecture

```
PREFERENCES SECTION
│
├─── FORM CONTAINER
│    │
│    ├── Dropdown Select
│    │   └── 37 friends (A-Z sorted)
│    │
│    └── Preference Buttons
│        ├── 🥗 Vegetarian
│        └── 🍗 Non-Vegetarian
│
├─── STATISTICS CARDS
│    ├── Card 1: Vegetarian Count
│    ├── Card 2: Non-Vegetarian Count
│    └── Card 3: Total Responses
│
└─── TABLE CONTAINER
     │
     ├── Filter Buttons
     │   ├── All Friends
     │   ├── 🥗 Vegetarian
     │   ├── 🍗 Non-Vegetarian
     │   └── ⏳ Not Selected
     │
     └── Friends Table
         ├── Column 1: Friend Name (A-Z)
         └── Column 2: Preference (color-coded)
```

---

## 🔐 Storage Model

```
localStorage["reunion-preferences-v1"] = {
  
  "1": {
    "name": "Akash",
    "preference": "veg",
    "timestamp": "2026-11-18T21:30:00.000Z"
  },
  
  "2": {
    "name": "Aloka",
    "preference": "nonveg",
    "timestamp": "2026-11-18T21:35:00.000Z"
  },
  
  "3": {
    "name": "Anil",
    "preference": null,  // Not submitted yet
    "timestamp": null
  },
  
  // ... more friends ...
  
  "37": {
    "name": "Tilu",
    "preference": "veg",
    "timestamp": "2026-11-18T22:00:00.000Z"
  }
}
```

---

## 📊 Statistics Calculation

```
TOTAL FRIENDS: 37

PREFERENCES DATA:
─────────────────
Vegetarian:     12 ✓
Non-Vegetarian: 13 ✓
Pending:        12 ⏳
─────────────────
TOTAL:          37

STATISTICS CARDS SHOW:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Vegetarian │  │Non-Vegetarian│  │ Total        │
│       12     │  │      13       │  │      25      │
└──────────────┘  └──────────────┘  └──────────────┘
                   (12 + 13 = 25)
```

---

## 🎯 Filtering Logic

```
TABLE DATA (Before Filter)
├─ Akash: veg
├─ Aloka: nonveg
├─ Anil: veg
├─ Biku: nonveg
├─ Biki: (pending)
└─ ... (37 total)

FILTER: "All" ────► Show all 37
FILTER: "veg" ────► Show only veg selections
FILTER: "nonveg" ─► Show only nonveg selections
FILTER: "pending" ► Show only unselected friends

Each filter re-sorts alphabetically
```

---

## ⚙️ Function Interactions

```
initializePreferences()
        │
        ├─► Load friends.js data
        │
        ├─► Populate dropdown
        │   └─► sortByName()
        │
        ├─► Set event listeners
        │   ├─► .addEventListener("change", friendSelect)
        │   ├─► .addEventListener("click", prefButton)
        │   ├─► .addEventListener("click", submitButton)
        │   └─► .addEventListener("click", filterButton)
        │
        ├─► updatePreferencesCounts()
        │   └─► Calculate stats
        │
        └─► renderPreferencesTable("all")
            └─► Display all friends
```

---

## 🚀 Deployment Pipeline

```
LOCAL DEVELOPMENT
       │
       ├─► Edit files locally
       ├─► Test in browser
       └─► Commit to git
              │
              ▼
        GIT REPOSITORY
        (patel97spatel/school_reunion)
              │
              ├─► .github/workflows/deploy.yml
              │
              ▼
        GITHUB ACTIONS
        (Automatic trigger on push)
              │
              ├─► Checkout code
              ├─► Upload artifact
              └─► Deploy to Pages
                     │
                     ▼
              GITHUB PAGES
        (https://username.github.io/school-reunion)
                     │
                     └─► Live on web! 🌐
```

---

**This system works seamlessly without any backend server or database!**
All data stays in the visitor's browser. ✨
