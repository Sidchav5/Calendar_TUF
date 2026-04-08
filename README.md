# Calendar TUF Frontend

A React-based calendar experience with month navigation, day selection, reminder management, notes, and an inspirational hero carousel.

## Live Demo

- https://calendartufsid.vercel.app/

## Features

- Month-by-month navigation across the full year.
- Interactive month grid with selected day and date range selection.
- Day-level reminders with title, note, and optional time.
- Month notes panel for quick bullet-style planning.
- Important days panel that highlights month-specific dates.
- Hero carousel with quote cards and image backgrounds per month.
- Theme toggle with persistent preference.
- Local persistence for reminders, notes, and theme through browser storage.

## Tech Stack

- React 19
- Create React App (react-scripts 5)
- Component-scoped CSS

## Project Structure

```text
src/
	components/
		CalendarPage.js
		CalendarGrid.js
		HeroCarousel.js
		DayDetailPanel.js
		ImportantDaysPanel.js
		MonthNotesPanel.js
		ReminderModal.js
	data/
		calendarData.js
		aprilData.js
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended

### Install

```bash
npm install
```

### Start Development Server

```bash
npm start
```

The app runs at http://localhost:3000.

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
```

Production output is generated in the build folder.

## Data Persistence

The UI stores user data in localStorage using these keys:

- tuf_calendar_reminders_by_month
- tuf_calendar_bullet_notes_by_month
- tuf_april_theme

## Notes

- Bootstrap is expected from the CDN entry in public/index.html.
- Styling is organized per component in src/components/\*.css.
