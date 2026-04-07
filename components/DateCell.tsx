'use client'

import { format, isSameDay } from 'date-fns'
import Tooltip from './Tooltip'

interface DateCellProps {
  date: Date
  today: Date
  isInRange: boolean
  isStart: boolean
  isEnd: boolean
  hasNote: boolean
  holidayMarker?: { type: string; label: string }
  onClick: () => void
  extractedColors: { primary: string; secondary: string }
  isWeekend: boolean
  isHighlighted?: boolean
  isStrikethrough?: boolean
}

export default function DateCell({
  date,
  today,
  isInRange,
  isStart,
  isEnd,
  hasNote,
  holidayMarker,
  onClick,
  extractedColors,
  isWeekend,
  isHighlighted = false,
  isStrikethrough = false
}: DateCellProps) {
  const isToday = isSameDay(date, today)
  const dayNumber = format(date, 'd')

  const getHolidayColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/50 animate-pulse'
      case 'assignment': return 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50 animate-pulse'
      case 'holiday': return 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/50 animate-pulse'
      case 'meeting': return 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/50 animate-pulse'
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600 shadow-lg shadow-gray-500/50'
    }
  }

  const getCellClasses = () => {
    let classes = 'calendar-cell h-8 w-8 md:h-10 md:w-10 flex flex-col items-center justify-center rounded-lg cursor-pointer border-2 transition-all duration-300 relative transform hover:scale-110'
    
    if (isToday) {
      classes += ' ring-2 md:ring-4 ring-yellow-400 ring-opacity-60 shadow-lg shadow-yellow-400/30'
    }
    
    if (isStart) {
      classes += ' date-range-start bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 shadow-lg shadow-blue-500/40'
    } else if (isEnd) {
      classes += ' date-range-end bg-gradient-to-br from-purple-500 to-purple-600 border-purple-400 shadow-lg shadow-purple-500/40'
    } else if (isInRange) {
      classes += ' date-range-middle bg-gradient-to-br from-green-400 to-green-500 border-green-300 shadow-md shadow-green-400/30'
    } else if (isHighlighted) {
      classes += ' bg-gradient-to-br from-yellow-400 to-orange-400 border-yellow-300 shadow-lg shadow-yellow-400/40 highlight-pulse'
    } else {
      classes += ' hover:bg-gradient-to-br hover:from-white/20 hover:to-white/30 hover:border-white/40 hover:shadow-lg hover:shadow-white/20 border-white/10'
    }
    
    if (isStrikethrough) {
      classes += ' strikethrough-date'
    }
    
    if (isStart || isEnd) {
      classes += ' text-white font-bold text-shadow'
    } else if (isInRange) {
      classes += ' text-white font-semibold'
    } else if (isHighlighted) {
      classes += ' text-white font-bold'
    } else if (isWeekend) {
      classes += ' weekend-date text-cyan-300 font-medium'
    } else {
      classes += ' text-white font-medium'
    }
    
    return classes
  }

  return (
    <div
      className={getCellClasses()}
      onClick={onClick}
      style={{
        backgroundColor: isStart || isEnd ? undefined : undefined,
      }}
    >
      <span className={`text-sm font-bold relative ${isToday ? 'text-yellow-300 drop-shadow-lg' : ''} ${isStrikethrough ? 'line-through' : ''}`}>
        {dayNumber}
      </span>
      
      {/* Strikethrough line */}
      {isStrikethrough && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-0.5 bg-red-500 line-through-animation" />
        </div>
      )}
      
      {/* Holiday marker */}
      {holidayMarker && (
        <Tooltip text={holidayMarker.label}>
          <div
            className={`absolute top-1 right-1 w-3 h-3 rounded-full holiday-marker ${getHolidayColor(holidayMarker.type)}`}
          />
        </Tooltip>
      )}
      
      {/* Note indicator */}
      {hasNote && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
      )}
    </div>
  )
}
