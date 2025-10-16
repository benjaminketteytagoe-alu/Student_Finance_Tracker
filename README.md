# Student Finance Tracker

A comprehensive web application for students to track their expenses, manage budgets, and develop healthy financial habits.

## Features

### Core Functionality
- **Transaction Management**: Add, edit, delete financial transactions
- **Budget Tracking**: Set monthly budgets with visual progress indicators
- **Advanced Search**: Regex-powered search across all transaction fields
- **Data Persistence**: Automatic saving to localStorage with JSON import/export
- **Responsive Design**: Mobile-first approach with three breakpoints (360px, 768px, 1024px)

### Regex Implementation
The application includes comprehensive regex validation and search capabilities:

#### Validation Patterns
1. **Description**: `/^\S(?:.*\S)?$/` - No leading/trailing spaces, collapses doubles
2. **Amount**: `/^(0|[1-9]\d*)(\.\d{1,2})?$/` - Positive numbers with up to 2 decimal places
3. **Date**: `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` - YYYY-MM-DD format
4. **Category**: `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` - Letters, spaces, hyphens

#### Advanced Regex (Back-reference)
- **Duplicate Words**: `/\b(\w+)\s+\1\b/i` - Detects repeated words in descriptions

#### Search Patterns Examples
- Find cents: `/\.\d{2}\b/`
- Beverage expenses: `/(coffee|tea)/i`
- Round amounts: `/^\d+\.00$/`
- Duplicate words: `/\\b(\\w+)\\s+\\1\\b/`

### Accessibility Features
- **Keyboard Navigation**: Full tab navigation with visible focus indicators
- **ARIA Live Regions**: Dynamic updates for budget status and notifications
- **Screen Reader Support**: Proper landmarks, labels, and descriptions
- **Skip Links**: Direct access to main content
- **High Contrast Support**: Media query for high contrast preferences
- **Reduced Motion**: Respects user motion preferences

### Data Model
```javascript
{
  id: "txn_0001",
  description: "Lunch at cafeteria",
  amount: 12.50,
  category: "Food",
  date: "2025-09-29",
  createdAt: "2025-09-29T10:30:00.000Z",
  updatedAt: "2025-09-29T10:30:00.000Z"
}