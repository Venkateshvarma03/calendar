import React, { useState } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CalendarPage from './CalendarPage'
import NotesPanel from './NotesPanel'
import WeatherWidget from './WeatherWidget'
import CalendarActions from './CalendarActions'
import DragDropScheduler from './DragDropScheduler'
import VoiceCommands from './VoiceCommands'

interface CalendarBookProps {
  currentMonth: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  onDateClick: (date: Date) => void
  selectedRange: { start: Date | null; end: Date | null }
  resetSelection: () => void
  getMonthDays: () => Date[]
  isDateInRange: (date: Date) => boolean
  isDateStart: (date: Date) => boolean
  isDateEnd: (date: Date) => boolean
  hasNote: (date: Date) => boolean
  getHolidayMarker: (date: Date) => any
  extractedColors: { primary: string; secondary: string }
  notes: any[]
  setNotes: (notes: any[]) => void
  holidayMarkers: any[]
  calendarEvents: any[]
  handleEventCreate: (event: any) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
  isFullscreen: boolean
  toggleFullscreen: () => void
  currentTheme: any
  handleThemeChange: (theme: any) => void
  isDateHighlighted: (date: Date) => boolean
  isDateStrikethrough: (date: Date) => boolean
  toggleDateHighlight: (date: Date) => void
  toggleDateStrikethrough: (date: Date) => void
}

// Background images for each month
const monthBackgrounds = {
  0: 'https://picsum.photos/seed/january-calendar/1200/800.jpg',  // January
  1: 'https://picsum.photos/seed/february-calendar/1200/800.jpg', // February
  2: 'https://picsum.photos/seed/march-calendar/1200/800.jpg',   // March
  3: 'https://picsum.photos/seed/april-calendar/1200/800.jpg',    // April
  4: 'https://picsum.photos/seed/may-calendar/1200/800.jpg',      // May
  5: 'https://picsum.photos/seed/june-calendar/1200/800.jpg',     // June
  6: 'https://picsum.photos/seed/july-calendar/1200/800.jpg',     // July
  7: 'https://picsum.photos/seed/august-calendar/1200/800.jpg',   // August
  8: 'https://picsum.photos/seed/september-calendar/1200/800.jpg', // September
  9: 'https://picsum.photos/seed/october-calendar/1200/800.jpg',   // October
  10: 'https://picsum.photos/seed/november-calendar/1200/800.jpg',  // November
  11: 'https://picsum.photos/seed/december-calendar/1200/800.jpg'   // December
}

export default function CalendarBook({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onDateClick,
  selectedRange,
  resetSelection,
  getMonthDays,
  isDateInRange,
  isDateStart,
  isDateEnd,
  hasNote,
  getHolidayMarker,
  extractedColors,
  notes,
  setNotes,
  holidayMarkers,
  calendarEvents,
  handleEventCreate,
  isDarkMode,
  toggleDarkMode,
  isFullscreen,
  toggleFullscreen,
  currentTheme,
  handleThemeChange,
  isDateHighlighted,
  isDateStrikethrough,
  toggleDateHighlight,
  toggleDateStrikethrough
}: CalendarBookProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const monthIndex = currentMonth.getMonth()
  const currentBackground = monthBackgrounds[monthIndex as keyof typeof monthBackgrounds]

  // Generate adjacent months for page effect
  const previousMonth = subMonths(currentMonth, 1)
  const nextMonth = addMonths(currentMonth, 1)
  const previousBackground = monthBackgrounds[previousMonth.getMonth() as keyof typeof monthBackgrounds]
  const nextBackground = monthBackgrounds[nextMonth.getMonth() as keyof typeof monthBackgrounds]

  const handlePageTurn = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentPage(Math.max(0, currentPage - 1))
      setTimeout(() => {
        onPreviousMonth()
        setCurrentPage(0)
      }, 600)
    } else {
      setCurrentPage(Math.max(0, currentPage - 1))
      setTimeout(() => {
        onNextMonth()
        setCurrentPage(0)
      }, 600)
    }
  }

  return (
    <div className="calendar-book relative w-full h-full">
      {/* Main calendar page */}
      <div className={`calendar-page-container ${currentPage !== 0 ? 'page-turning' : ''}`}>
        <CalendarPage
          month={currentMonth}
          onDateClick={onDateClick}
          selectedRange={selectedRange}
          isDateInRange={isDateInRange}
          isDateStart={isDateStart}
          isDateEnd={isDateEnd}
          hasNote={hasNote}
          getHolidayMarker={getHolidayMarker}
          extractedColors={extractedColors}
          backgroundImage={currentBackground}
          isDateHighlighted={isDateHighlighted}
          isDateStrikethrough={isDateStrikethrough}
        />
      </div>

      {/* Page navigation */}
      <div className="calendar-navigation">
        <button
          onClick={() => handlePageTurn('prev')}
          className="nav-button prev-button absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-black/30 backdrop-blur-md rounded-full hover:bg-black/50 transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
        </button>
        <button
          onClick={() => handlePageTurn('next')}
          className="nav-button next-button absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-black/30 backdrop-blur-md rounded-full hover:bg-black/50 transition-all duration-200"
        >
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
        </button>
      </div>

      {/* Side panels */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-black/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200 text-white"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-black/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200 text-white"
          >
            ⛶
          </button>
        </div>
      </div>

      {/* Additional features overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
          {/* Notes Panel */}
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-2 lg:p-4 max-h-32 lg:max-h-64 overflow-y-auto">
            <NotesPanel
              selectedRange={selectedRange}
              currentMonth={currentMonth}
              notes={notes}
              setNotes={setNotes}
              extractedColors={extractedColors}
            />
          </div>
          
          {/* Events */}
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-2 lg:p-4 max-h-32 lg:max-h-64 overflow-y-auto">
            <h3 className="text-sm lg:text-lg font-semibold text-white mb-2 lg:mb-4">Scheduled Events</h3>
            <div className="space-y-1 lg:space-y-2">
              {calendarEvents.length === 0 ? (
                <p className="text-white/80 text-xs lg:text-sm">No events scheduled</p>
              ) : (
                calendarEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center space-x-2 lg:space-x-3 p-1 lg:p-2 bg-white/10 rounded">
                    <div 
                      className="w-2 h-2 lg:w-3 lg:h-3 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1">
                      <p className="text-xs lg:text-sm font-medium text-white">{event.title}</p>
                      <p className="text-xs lg:text-xs text-white/70">{event.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="absolute top-4 left-4 z-10">
        <WeatherWidget />
      </div>

      {/* Voice Commands */}
      <VoiceCommands />
    </div>
  )
}
