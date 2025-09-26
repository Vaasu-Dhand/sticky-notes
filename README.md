# [Sticky Notes App](https://stickynotesabsorb.netlify.app)

[Live App](https://stickynotesabsorb.netlify.app)

A slick, responsive sticky web application built with React and TypeScript. Features drag-and-drop functionality, resizable notes, color customization, dark mode, and persistent storage with trash/restore functionality.

## Features

1. Create Notes: Click "Add Note" to create a new sticky note at an available position
2. Drag & Move: Drag notes anywhere on the canvas using react-grid-layout
3. Resize Notes: Resize notes in all directions (8 resize handles: corners + edges)
4. Delete Notes: Delete notes which are moved to a recoverable trash system
5. Local Storage: Notes and layouts persist between browser sessions
6. Color Palette: 12 vibrant colors maintaining theme consistency
7. Dark/Light Mode: Toggle between themes with system preference detection
8. Trash & Restore System: Deleted notes go to a recoverable trash panel instead of permanent deletion
9. REST API Simulation: Mock async API calls for all CRUD operations

## Architecture
### Component Architecture
The application follows a clean, modular architecture with custom hooks managing state and business logic:

### Custom Hooks:

1. `useNotesManager`: Central state management for notes, handling CRUD operations, layout management, and API simulation
2. `useLocalStorage`: Generic hook for persistent browser storage with error handling

## Local Setup & Installation

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher

### Installation Steps

1. **Clone the repository**:
```bash
git clone https://github.com/Vaasu-Dhand/sticky-notes
cd sticky-notes-app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the app**:
```bash
npm run dev
```