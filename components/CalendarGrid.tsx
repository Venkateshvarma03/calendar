'use client'

import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { format, getDay, startOfMonth } from 'date-fns'
import { isWeekend } from '@/utils/calendarUtils'
import DateCell from './DateCell'

interface CalendarGridProps {
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
}

const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export default function CalendarGrid({
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
  extractedColors
}: CalendarGridProps) {
  const monthDays = getMonthDays()
  // Adjust for Monday start (Sunday = 0, Monday = 1)
  const startDay = getDay(startOfMonth(currentMonth)) === 0 ? 6 : getDay(startOfMonth(currentMonth)) - 1
  const today = new Date()

  // Create empty cells for days before month starts (Monday as first day)
  const emptyCells = Array(startDay).fill(null)

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-lg p-4">
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Week days header */}
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-bold py-2 ${
              index >= 5 ? 'text-blue-400' : 'text-white'
            }`}
          >
            {day}
          </div>
        ))}
        
        {/* Empty cells for days before month starts */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}

        {/* Actual days */}
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
            isWeekend={isWeekend(date)}
          />
        ))}
      </div>
    </div>
  )
}
