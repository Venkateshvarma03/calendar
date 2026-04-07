'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  date: string
  time?: string
  location?: string
  attendees?: string[]
  category: 'work' | 'personal' | 'meeting' | 'holiday'
  color: string
}

export default function DragDropScheduler({ 
  onEventCreate, 
  selectedDate 
}: {
  onEventCreate: (event: CalendarEvent) => void
  selectedDate: Date | null
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedEventType, setDraggedEventType] = useState<string>('')
  
  const eventTemplates = [
    { type: 'meeting', icon: Users, label: 'Meeting', color: '#3B82F6' },
    { type: 'work', icon: Calendar, label: 'Work', color: '#10B981' },
    { type: 'personal', icon: Clock, label: 'Personal', color: '#F59E0B' },
    { type: 'holiday', icon: MapPin, label: 'Holiday', color: '#EF4444' }
  ]

  const handleDragStart = (eventType: string) => {
    setIsDragging(true)
    setDraggedEventType(eventType)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDraggedEventType('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (draggedEventType && selectedDate) {
      const template = eventTemplates.find(t => t.type === draggedEventType)
      if (template) {
        const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          title: `New ${template.label}`,
          date: selectedDate.toISOString().split('T')[0],
          category: draggedEventType as CalendarEvent['category'],
          color: template.color
        }
        onEventCreate(newEvent)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Tag className="w-5 h-5 mr-2" />
        Event Templates
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {eventTemplates.map((template) => {
          const Icon = template.icon
          return (
            <div
              key={template.type}
              draggable
              onDragStart={() => handleDragStart(template.type)}
              onDragEnd={handleDragEnd}
              className={`flex items-center space-x-3 p-3 rounded-lg border-2 border-dashed cursor-move transition-all duration-200 hover:shadow-md ${
                isDragging && draggedEventType === template.type 
                  ? 'opacity-50 scale-95 border-blue-400 bg-blue-500/20' 
                  : 'border-white/30 hover:border-white/50'
              }`}
              style={{ borderColor: template.color }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: template.color + '20' }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: template.color }} 
                />
              </div>
              <span className="text-sm font-medium text-white">{template.label}</span>
            </div>
          )
        })}
      </div>
      
      {selectedDate && (
        <div 
          className="mt-4 p-4 bg-white/10 rounded-lg border-2 border-dashed border-white/30 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p className="text-sm text-white/80">
            Drop event template here to add to {selectedDate.toLocaleDateString()}
          </p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-white/60">
        <p>Drag and drop event templates onto calendar dates to quickly schedule events.</p>
      </div>
    </div>
  )
}
