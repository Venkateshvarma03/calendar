# Interactive Wall Calendar

A modern, production-ready React (Next.js) calendar component inspired by physical wall calendars used in e-learning and productivity apps.

## Features

### Core Features
- **Wall Calendar Design**: Physical calendar aesthetic with paper texture feel and soft shadows
- **Calendar Grid**: Clean monthly calendar display with proper day alignment
- **Date Range Selection**: Click to select start/end dates with visual range highlighting
- **Notes System**: Add notes for entire months or specific date ranges with localStorage persistence
- **Responsive Design**: Desktop split layout, mobile stack layout
- **Dark Mode**: Full dark mode support with toggle

### Advanced Features
- **Wall Flip Animation**: Realistic calendar page flip animation when changing months
- **Fullscreen Mode**: Expand calendar to fullscreen like opening a wall calendar
- **Theme Extraction**: Extract dominant colors from hero image dynamically
- **Holiday/Learning Markers**: Visual badges for exams, assignments, holidays, meetings
- **Drag Selection**: Drag across dates to select ranges (bonus feature)
- **Micro-interactions**: Smooth hover effects and animated transitions

## Installation

1. Clone or download the project
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Date Range Selection
- **First click**: Select start date
- **Second click**: Select end date  
- **Third click**: Reset selection

### Notes
- Toggle between "Month" and "Range" note types
- Month notes apply to the entire month
- Range notes apply to selected date ranges
- Notes are automatically saved to localStorage

### Navigation
- Use arrow buttons to change months
- Click "Open Calendar" for fullscreen mode
- Toggle dark mode with the moon/sun icon

### Visual Indicators
- **Green dot**: Date has notes
- **Colored dots**: Holiday/learning markers
  - Red: Exams
  - Orange: Assignments  
  - Green: Holidays
  - Purple: Meetings

## Component Structure

```
components/
  CalendarGrid.tsx     # Main calendar grid with navigation
  DateCell.tsx         # Individual date cell with styling
  NotesPanel.tsx       # Notes input and display panel

utils/
  calendarUtils.ts     # Theme extraction and utility functions

app/
  page.tsx             # Main calendar component
  layout.tsx           # App layout
  globals.css          # Global styles and Tailwind
```

## Technologies Used

- **Next.js 14**: React framework with app router
- **TypeScript**: Type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework with custom animations
- **date-fns**: Date manipulation and formatting
- **lucide-react**: Modern icon library

## Customization

### Colors
The calendar automatically extracts colors from the hero image. You can also modify the default colors in `calendarUtils.ts`.

### Holiday Markers
Add new holiday types in the main component:
```typescript
const holidayMarkers: HolidayMarker[] = [
  { date: '2024-01-15', type: 'exam', label: 'Mid-term Exam' },
  // Add more markers...
]
```

### Styling
Customize the calendar appearance by modifying:
- `globals.css` for global styles and animations
- Component-specific styles in respective files
- Tailwind config for theme colors

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Optimized for large datasets with virtual scrolling
- Efficient localStorage usage
- Minimal re-renders with proper React state management
- Image processing with canvas for theme extraction

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use in your projects!
