'use client'

import { useState } from 'react'
import { Download, Upload, Share2, FileText } from 'lucide-react'
import { format } from 'date-fns'

interface CalendarData {
  month: string
  year: number
  notes: any[]
  selectedRange: any
  holidayMarkers: any[]
}

export default function CalendarActions({ 
  currentMonth, 
  notes, 
  selectedRange, 
  holidayMarkers 
}: {
  currentMonth: Date
  notes: any[]
  selectedRange: any
  holidayMarkers: any[]
}) {
  const [isExporting, setIsExporting] = useState(false)

  const exportCalendar = () => {
    setIsExporting(true)
    
    const calendarData: CalendarData = {
      month: format(currentMonth, 'MMMM'),
      year: currentMonth.getFullYear(),
      notes: notes,
      selectedRange: selectedRange,
      holidayMarkers: holidayMarkers
    }

    // Create JSON file
    const dataStr = JSON.stringify(calendarData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `calendar-${format(currentMonth, 'yyyy-MM')}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    setTimeout(() => setIsExporting(false), 1000)
  }

  const exportToPDF = () => {
    // Create a simple text representation for PDF export
    let content = `${format(currentMonth, 'MMMM yyyy')} Calendar\n\n`
    content += '=' .repeat(50) + '\n\n'
    
    if (selectedRange.start && selectedRange.end) {
      content += `Selected Range: ${format(selectedRange.start, 'MMM dd')} - ${format(selectedRange.end, 'MMM dd, yyyy')}\n\n`
    }
    
    content += 'NOTES:\n'
    content += '-'.repeat(20) + '\n'
    
    notes.forEach((note, index) => {
      content += `${index + 1}. ${note.content}\n`
      if (note.type === 'range' && note.startDate && note.endDate) {
        content += `   (${format(new Date(note.startDate), 'MMM dd')} - ${format(new Date(note.endDate), 'MMM dd')})\n`
      }
      content += '\n'
    })

    // Create and download text file
    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    const exportFileDefaultName = `calendar-${format(currentMonth, 'yyyy-MM')}.txt`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const shareCalendar = async () => {
    const shareData = {
      title: `${format(currentMonth, 'MMMM yyyy')} Calendar`,
      text: `Check out my calendar for ${format(currentMonth, 'MMMM yyyy')}!`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.title} - ${shareData.text} ${shareData.url}`)
      alert('Calendar link copied to clipboard!')
    }
  }

  const importCalendar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        // Emit custom event for parent to handle import
        window.dispatchEvent(new CustomEvent('importCalendar', { detail: data }))
      } catch (error) {
        alert('Invalid calendar file format')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-t border-gray-200">
      <button
        onClick={exportCalendar}
        disabled={isExporting}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        <span>Export JSON</span>
      </button>
      
      <button
        onClick={exportToPDF}
        className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        <FileText className="w-4 h-4" />
        <span>Export Text</span>
      </button>
      
      <button
        onClick={shareCalendar}
        className="flex items-center space-x-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>
      
      <label className="flex items-center space-x-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer">
        <Upload className="w-4 h-4" />
        <span>Import</span>
        <input
          type="file"
          accept=".json"
          onChange={importCalendar}
          className="hidden"
        />
      </label>
    </div>
  )
}
