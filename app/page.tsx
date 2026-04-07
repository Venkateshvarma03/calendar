'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Moon, Sun, Calendar as CalendarIcon, Download, Upload, Palette } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import CalendarGrid from '@/components/CalendarGrid'
import NotesPanel from '@/components/NotesPanel'
import DateCell from '@/components/DateCell'
import WeatherWidget from '@/components/WeatherWidget'
import Tooltip from '@/components/Tooltip'
import ParticleEffects from '@/components/ParticleEffects'
import VoiceCommands from '@/components/VoiceCommands'
import CalendarActions from '@/components/CalendarActions'
import DragDropScheduler from '@/components/DragDropScheduler'
import CalendarThemes, { predefinedThemes } from '@/components/CalendarThemes'
import CalendarBook from '@/components/CalendarBook'
import { extractColorsFromImage } from '@/utils/calendarUtils'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface Note {
  id: string
  date: string
  content: string
  type: 'month' | 'range'
  startDate?: string
  endDate?: string
}

export interface HolidayMarker {
  date: string
  type: 'exam' | 'assignment' | 'holiday' | 'meeting'
  label: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time?: string
  location?: string
  attendees?: string[]
  category: 'work' | 'personal' | 'meeting' | 'holiday'
  color: string
}

export default function InteractiveWallCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null })
  const [notes, setNotes] = useState<Note[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [extractedColors, setExtractedColors] = useState({ primary: '#3B82F6', secondary: '#10B981' })
  const [showParticles, setShowParticles] = useState(false)
  const [draggedEvent, setDraggedEvent] = useState<any>(null)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [currentTheme, setCurrentTheme] = useState(predefinedThemes[4]) // Light mode as default
  const heroImageUrl = currentTheme.heroImage
  const [backgroundImage, setBackgroundImage] = useState('https://picsum.photos/seed/calendar-background/1920/1080.jpg')
  const [highlightedDates, setHighlightedDates] = useState<string[]>([])
  const [strikethroughDates, setStrikethroughDates] = useState<string[]>([])
  const [holidayMarkers] = useState<HolidayMarker[]>([
    { date: format(new Date(), 'yyyy-MM-15'), type: 'exam', label: 'Mid-term Exam' },
    { date: format(new Date(), 'yyyy-MM-20'), type: 'assignment', label: 'Project Due' },
    { date: format(new Date(), 'yyyy-MM-25'), type: 'holiday', label: 'Holiday' },
  ])

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('calendar-notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
    
    const savedDarkMode = localStorage.getItem('calendar-dark-mode')
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendar-notes', JSON.stringify(notes))
  }, [notes])

  // Extract colors from hero image
  useEffect(() => {
    extractColorsFromImage(heroImageUrl).then(colors => {
      setExtractedColors(colors)
    })
  }, [heroImageUrl])

  // Handle calendar import
  useEffect(() => {
    const handleImport = (event: CustomEvent) => {
      const data = event.detail
      if (data.notes) setNotes(data.notes)
      if (data.selectedRange) setSelectedRange(data.selectedRange)
      if (data.holidayMarkers) {
        // Update holiday markers if needed
      }
    }

    window.addEventListener('importCalendar', handleImport as EventListener)
    return () => window.removeEventListener('importCalendar', handleImport as EventListener)
  }, [])

  // Apply theme
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--theme-primary', currentTheme.colors.primary)
    root.style.setProperty('--theme-secondary', currentTheme.colors.secondary)
    root.style.setProperty('--theme-accent', currentTheme.colors.accent)
    root.style.setProperty('--theme-background', currentTheme.colors.background)
    root.style.setProperty('--theme-text', currentTheme.colors.text)
  }, [currentTheme])

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('calendar-notes', JSON.stringify(notes))
  }, [notes])

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('calendar-dark-mode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const handlePreviousMonth = () => {
    setIsFlipping(true)
    setShowParticles(true)
    setTimeout(() => {
      setCurrentMonth(subMonths(currentMonth, 1))
      setIsFlipping(false)
      setShowParticles(false)
    }, 800)
  }

  const handleNextMonth = () => {
    setIsFlipping(true)
    setShowParticles(true)
    setTimeout(() => {
      setCurrentMonth(addMonths(currentMonth, 1))
      setIsFlipping(false)
      setShowParticles(false)
    }, 800)
  }

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date)
    console.log('Current selectedRange:', selectedRange)
    
    if (!selectedRange.start) {
      console.log('Setting start date')
      setSelectedRange({ start: date, end: null })
    } else if (!selectedRange.end) {
      console.log('Setting end date')
      if (date < selectedRange.start) {
        setSelectedRange({ start: date, end: selectedRange.start })
      } else {
        setSelectedRange({ ...selectedRange, end: date })
      }
    } else {
      console.log('Resetting selection')
      setSelectedRange({ start: date, end: null })
    }
  }

  const handleEventCreate = (event: CalendarEvent) => {
    setCalendarEvents([...calendarEvents, event])
  }

  const handleThemeChange = (theme: any) => {
    setCurrentTheme(theme)
    // Update background image based on theme
    const themeBackgrounds = {
      'mountain': 'https://picsum.photos/seed/mountain-background/1920/1080.jpg',
      'beach': 'https://picsum.photos/seed/beach-background/1920/1080.jpg',
      'forest': 'https://picsum.photos/seed/forest-background/1920/1080.jpg',
      'dark': 'https://picsum.photos/seed/dark-background/1920/1080.jpg',
      'light': 'https://picsum.photos/seed/light-background/1920/1080.jpg'
    }
    setBackgroundImage(themeBackgrounds[theme.id as keyof typeof themeBackgrounds] || themeBackgrounds.light)
  }

  const resetSelection = () => {
    setSelectedRange({ start: null, end: null })
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const getMonthDays = () => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }

  const isDateInRange = (date: Date) => {
    if (!selectedRange.start || !selectedRange.end) {
      console.log('isDateInRange false - missing start or end')
      return false
    }
    const result = date >= selectedRange.start && date <= selectedRange.end
    console.log('isDateInRange for', date, ':', result, 'range:', selectedRange)
    return result
  }

  const isDateStart = (date: Date): boolean => {
    return selectedRange.start ? isSameDay(date, selectedRange.start) : false
  }

  const isDateEnd = (date: Date): boolean => {
    return selectedRange.end ? isSameDay(date, selectedRange.end) : false
  }

  const hasNote = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return notes.some(note => 
      note.type === 'month' ? 
      format(new Date(note.date), 'yyyy-MM') === format(date, 'yyyy-MM') :
      note.date === dateStr || 
      (note.startDate && note.endDate && date >= new Date(note.startDate) && date <= new Date(note.endDate))
    )
  }

  const getHolidayMarker = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return holidayMarkers.find(marker => marker.date === dateStr)
  }

  const isDateHighlighted = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return highlightedDates.includes(dateStr)
  }

  const isDateStrikethrough = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return strikethroughDates.includes(dateStr)
  }

  const toggleDateHighlight = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    if (highlightedDates.includes(dateStr)) {
      setHighlightedDates(highlightedDates.filter(d => d !== dateStr))
    } else {
      setHighlightedDates([...highlightedDates, dateStr])
    }
  }

  const toggleDateStrikethrough = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    if (strikethroughDates.includes(dateStr)) {
      setStrikethroughDates(strikethroughDates.filter(d => d !== dateStr))
    } else {
      setStrikethroughDates([...strikethroughDates, dateStr])
    }
  }

  return (
    <div 
      className={`min-h-screen p-2 md:p-4 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 p-4 md:p-8' : ''}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 via-gray-800/5 to-gray-900/10 backdrop-blur-[1px]" />
      
      <div className="relative max-w-6xl mx-auto">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-2 md:mb-4">
          <div className="flex items-center space-x-2 md:space-x-4">
            <CalendarThemes 
              currentTheme={currentTheme} 
              onThemeChange={handleThemeChange} 
            />
          </div>
          <div className="flex space-x-1 md:space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 md:p-2 rounded-lg bg-black/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200 text-white"
            >
              {isDarkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 md:p-2 rounded-lg bg-black/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200 text-white"
            >
              <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Book */}
        <CalendarBook
          currentMonth={currentMonth}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onDateClick={handleDateClick}
          selectedRange={selectedRange}
          resetSelection={resetSelection}
          getMonthDays={getMonthDays}
          isDateInRange={isDateInRange}
          isDateStart={isDateStart}
          isDateEnd={isDateEnd}
          hasNote={hasNote}
          getHolidayMarker={getHolidayMarker}
          extractedColors={extractedColors}
          notes={notes}
          setNotes={setNotes}
          holidayMarkers={holidayMarkers}
          calendarEvents={calendarEvents}
          handleEventCreate={handleEventCreate}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          currentTheme={currentTheme}
          handleThemeChange={handleThemeChange}
          isDateHighlighted={isDateHighlighted}
          isDateStrikethrough={isDateStrikethrough}
          toggleDateHighlight={toggleDateHighlight}
          toggleDateStrikethrough={toggleDateStrikethrough}
        />
      </div>
    </div>
  )
}
