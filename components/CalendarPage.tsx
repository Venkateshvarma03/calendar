import React from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay } from 'date-fns'
import DateCell from './DateCell'

interface CalendarPageProps {
  month: Date
  onDateClick: (date: Date) => void
  selectedRange: { start: Date | null; end: Date | null }
  isDateInRange: (date: Date) => boolean
  isDateStart: (date: Date) => boolean
  isDateEnd: (date: Date) => boolean
  hasNote: (date: Date) => boolean
  getHolidayMarker: (date: Date) => any
  extractedColors: { primary: string; secondary: string }
  backgroundImage: string
  isDateHighlighted: (date: Date) => boolean
  isDateStrikethrough: (date: Date) => boolean
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function CalendarPage({
  month,
  onDateClick,
  selectedRange,
  isDateInRange,
  isDateStart,
  isDateEnd,
  hasNote,
  getHolidayMarker,
  extractedColors,
  backgroundImage,
  isDateHighlighted,
  isDateStrikethrough
}: CalendarPageProps) {
  const monthDays = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month)
  }).filter(date => isSameMonth(date, month))

  // Adjust for Monday start (Sunday = 0, Monday = 1)
  const startDay = getDay(startOfMonth(month)) === 0 ? 6 : getDay(startOfMonth(month)) - 1
  const today = new Date()

  // Create empty cells for days before month starts (Monday as first day)
  const emptyCells = Array(startDay).fill(null)

  return (
    <div 
      className="calendar-page relative w-full h-full rounded-lg shadow-2xl overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Page overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
      
      {/* Page content */}
      <div className="relative z-10 p-4 md:p-8 h-full flex flex-col">
        {/* Month header */}
        <div className="text-center mb-4 md:mb-6">
          <h1 
            className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg"
            style={{ color: extractedColors.primary }}
          >
            {format(month, 'MMMM yyyy').toUpperCase()}
          </h1>
          <div 
            className="w-20 md:w-32 h-1 mx-auto rounded-full"
            style={{ backgroundColor: extractedColors.secondary }}
          />
        </div>

        {/* Calendar grid */}
        <div className="flex-1 flex flex-col">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`text-center text-xs md:text-sm font-bold py-1 md:py-2 ${
                  index >= 5 ? 'text-blue-300' : 'text-white'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days grid */}
          <div className="flex-1 grid grid-cols-7 gap-1 md:gap-2">
            {/* Empty cells for alignment */}
            {emptyCells.map((_, index) => (
              <div key={`empty-${index}`} className="p-1 md:p-2" />
            ))}

            {/* Calendar days */}
            {monthDays.map((date) => (
              <DateCell
                key={date.toString()}
                date={date}
                today={today}
                isInRange={isDateInRange(date)}
                isStart={isDateStart(date)}
                isEnd={isDateEnd(date)}
                hasNote={hasNote(date)}
                holidayMarker={getHolidayMarker(date)}
                onClick={() => onDateClick(date)}
                extractedColors={extractedColors}
                isWeekend={getDay(date) === 0 || getDay(date) === 6}
                isHighlighted={isDateHighlighted(date)}
                isStrikethrough={isDateStrikethrough(date)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
