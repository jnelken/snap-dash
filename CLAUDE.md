# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite dashboard application for displaying 9 time series charts with advanced interactivity. The project implements multiple layout modes (vertical, grid, free), synchronized hover effects, and date range selection across all charts.

## Development Commands

- `npm run dev`: Start Vite development server with hot reload
- `npm run build`: TypeScript compilation + production build (use this for type checking)  
- `npm run lint`: Run ESLint for code quality checks
- `npm run preview`: Serve the production build locally

## Architecture & Code Organization

### Project Structure
The project is organized as follows:
- `src/features/dashboard/`: Main dashboard container component
- `src/components/`: All UI components (charts, layout, interactions)
- `src/lib/`: Utility functions, custom hooks, and React contexts
  - `src/lib/contexts/`: React Context providers for state management
  - `src/lib/hooks/`: Custom React hooks
  - `src/lib/utils/`: Utility functions
- `src/assets/`: Static assets

### Key Technical Requirements
1. **Layout Modes**: Three layout systems (vertical, 3x3 grid, free positioning)
2. **Chart Interactivity**: 
   - Synchronized hover across all 9 charts at same X-axis position
   - Date range selection via date picker OR click-drag within charts
   - Responsive scaling during resize/reposition operations
3. **Free Layout Mode**:
   - Drag to reposition charts anywhere on dashboard
   - Resize via bottom-right corner handles
   - No chart overlap - responsive flow within rows
   - Persistent position/size storage in localStorage

### State Management
The application uses React Context API for state management:
- **DateRangeContext** (`src/lib/contexts/DateRangeContext.tsx`): Manages date range selection and hover state synchronization across all charts
- **GridLayoutContext** (`src/lib/contexts/GridLayoutContext.tsx`): Manages layout mode (vertical/grid/free) and chart positions/dimensions in free layout mode
- **Local UI State**: Transient interactions remain local to components
- **Persistence**: Layout configurations are saved to localStorage

### Chart Implementation
- Custom SVG-based bar chart implementation (`src/components/BarChart.tsx`)
- No external charting library dependencies
- Mock time series data generation via `useData` hook (`src/lib/hooks/useData.tsx`)
- Interactive overlay layer (`src/components/ChartInteractionLayer.tsx`) handles hover and drag-to-select
- Synchronized hover visualization (`src/components/HoverBar.tsx`) and tooltips (`src/components/StaticTooltip.tsx`)

## Code Style

- TypeScript strict mode enabled
- 2-space indentation, semicolons required
- PascalCase for component files (e.g., `HoverSyncCursor.tsx`)
- camelCase for utility files, `useThing.ts` pattern for hooks
- CSS Modules for styling (`*.module.css`)
- Functional components and hooks (no class components)

## Testing

- Vitest + React Testing Library for component testing
- Colocate tests as `ComponentName.test.tsx`
- Focus testing on core behaviors: layout switching, hover sync, range selection
- Mock data and time deterministically

## Key Implementation Notes

- Charts must maintain readability during all resize operations  
- Date range updates should affect all 9 charts simultaneously
- Free layout should prevent chart overlaps through intelligent positioning
- Match Figma mocks as closely as possible
- Consider efficient time series data patterns for production scaling