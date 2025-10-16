# The NauriTrack Student Finance Tracker

### [Live URL]: (https://benjaminketteytagoe-alu.github.io/Student_Finance_Tracker/)

### [Repository]: (https://github.com/benjaminketteytagoe-alu/Student_Finance_Tracker)

# Project Overview

Student Finance Tracker is a web-based budget management tool designed to help ALU students monitor their income and expenses efficiently.
The application allows users to add, edit, delete, search, and analyze financial transactions, ensuring they maintain control over their spending habits.

The app is built entirely with HTML, CSS, and JavaScript (ES6 modules, DOM) — no external frameworks — and supports localStorage persistence, regex-based input validation, accessibility compliance, and responsive design.

### Chosen Theme

## Theme: Student Finance Tracker
A personal finance management application tailored for students to organize, analyze, and optimize their spending habits while learning basic financial literacy through interactive insights.

# Features List

✅ Add, edit, and delete expense or income records

✅ Regex validation for accurate input entry

✅ Regex-based live search with advanced pattern matching

✅ Sorting by description, amount, or date (both ascending and descending)

✅ Persistent storage using localStorage

✅ JSON Import/Export with structure validation

✅ Stats Dashboard with total records, spending sum, top category, and 7-day trend

✅ Budget cap/target with ARIA live feedback (polite/alert modes)

✅ Multi-currency system with manual rate conversion in Settings

✅ Fully responsive layout (mobile-first: 360px, tablet: 768px, desktop: 1024px)

✅ Accessibility (a11y): Keyboard-friendly, ARIA roles, high-contrast design

✅ Smooth animations and transitions with CSS3

## Regex Catalog (Patterns + Examples)
Validation Type	Regex Pattern	Purpose	Example (✅/❌)
``` Description/title	/^\\S(?:.*\\S)?$/	Prevents leading/trailing spaces	✅ “Lunch at cafe” / ❌ “ Lunch ”
Amount (currency)	`/^(0	[1-9]\d*)(\.\d{1,2})?$/`	Ensures valid numeric value up to 2 decimals
Date (YYYY-MM-DD)	`/^\d{4}-(0[1-9]	1[0-2])-(0[1-9]	[12]\d
Category/tag	/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/	Allows letters, spaces, and hyphens only	✅ “Transport” / ❌ “Food123”
Advanced Regex (Back-reference)	/\\b(\\w+)\\s+\\1\\b/	Detects consecutive duplicate words	✅ “coffee” / ❌ “coffee coffee”
``` 

Search Examples:

/\\b(tea|coffee)\\b/i → Find beverage-related entries

/\\.\\d{2}\\b/ → Match records with exact cents

/food/i → Case-insensitive search for category “Food”

# Data Model

Each record follows a consistent JSON structure and is automatically stored in localStorage.

{
  "id": "unique-id",
  "description": "Lunch at cafeteria",
  "amount": 8.50,
  "category": "Food",
  "date": "2025-10-10",
  "createdAt": "2025-10-10T08:00:00Z",
  "updatedAt": "2025-10-10T08:00:00Z"
}


Changes are autosaved and reflected in the UI immediately.
Import/export options ensure seamless backup and transfer of data.

# seed.json Sample

A preloaded seed.json file includes 10 diverse sample records with various categories, edge dates, and tricky strings.
```
[
  {
    "id": "1",
    "description": "Lunch at cafeteria",
    "amount": 8.50,
    "category": "Food",
    "date": "2025-10-10"
  },
  {
    "id": "2",
    "description": "coffee coffee",
    "amount": 3.00,
    "category": "Beverages",
    "date": "2025-09-29"
  },
  {
    "id": "3",
    "description": "Data bundle renewal",
    "amount": 15.75,
    "category": "Other",
    "date": "2025-10-05"
  },
  {
    "id": "4",
    "description": "Bus fare to campus",
    "amount": 2.50,
    "category": "Transport",
    "date": "2025-10-09"
  },
  {
    "id": "5",
    "description": "Math textbook",
    "amount": 42.00,
    "category": "Books",
    "date": "2025-09-20"
  },
  {
    "id": "6",
    "description": "Movie night",
    "amount": 10.00,
    "category": "Entertainment",
    "date": "2025-10-01"
  },
  {
    "id": "7",
    "description": "Library printing fees",
    "amount": 1.20,
    "category": "Fees",
    "date": "2025-10-02"
  },
  {
    "id": "8",
    "description": "Online course subscription",
    "amount": 25.00,
    "category": "Education",
    "date": "2025-09-15"
  },
  {
    "id": "9",
    "description": "Snacks and tea",
    "amount": 5.25,
    "category": "Food",
    "date": "2025-10-08"
  },
  {
    "id": "10",
    "description": "Club membership fee",
    "amount": 12.00,
    "category": "Other",
    "date": "2025-09-10"
  }
]
```
# Keyboard Map
Action	Key(s)
Navigate between fields	Tab / Shift + Tab
Submit form	Enter
Cancel edit	Esc
Sort by column	Arrow keys + Enter
Navigate table	↑ / ↓
Skip to main content	Alt + S
Accessibility (a11y) Notes

The project follows WCAG 2.1 AA guidelines:

Semantic HTML (<header>, <nav>, <main>, <section>, <footer>)

ARIA roles and live regions (role="status", aria-live="polite" and assertive)

Keyboard-friendly interactions

Visible focus outlines for all buttons and form elements

Proper color contrast for readability

Skip-to-content link for assistive technology

Tested across major browsers and screen widths (mobile-first)

# Running Tests

Open the file tests.html in your browser.

Verify:

Regex validations work (invalid inputs show clear error messages).

All functions pass without console errors.

Check console logs for test results summary.

# Demo Video

# Unlisted YouTube Link:
[demo video link] (https://youtu.be/BCG3dqOx7N8)

The video demonstrates:

Full keyboard-only navigation

Regex edge case handling

JSON import/export

Dashboard and budget cap updates

# Wireframe
[wireframe here](https://www.canva.com/design/DAG19mSFp0A/dDRP5JxwQG89Giz90s8Dgg/edit?utm_content=DAG19mSFp0A&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

# Deployment Notes

This project must be hosted only on GitHub Pages.
### Repo: https://github.com/benjaminketteytagoe-alu/Student_Finance_Tracker
### Live Page: https://benjaminketteytagoe-alu.github.io/Student_Finance_Tracker/

# Author

### Benjamin Kettey-Tagoe
b.kettey-ta@alustudent.com

### GitHub Profile
benjaminketteytagoe-alu
