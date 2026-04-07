'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { StickyNote, Calendar, Save, Trash2 } from 'lucide-react'

interface NotesPanelProps {
  selectedRange: { start: Date | null; end: Date | null }
  currentMonth: Date
  notes: any[]
  setNotes: (notes: any[]) => void
  extractedColors: { primary: string; secondary: string }
}

export default function NotesPanel({
  selectedRange,
  currentMonth,
  notes,
  setNotes,
  extractedColors
}: NotesPanelProps) {
  const [noteType, setNoteType] = useState<'month' | 'range'>('range')
  const [currentNote, setCurrentNote] = useState('')

  const getTargetDescription = () => {
    if (noteType === 'month') {
      return format(currentMonth, 'MMMM yyyy')
    } else if (selectedRange.start && selectedRange.end) {
      return `${format(selectedRange.start, 'MMM dd')} - ${format(selectedRange.end, 'MMM dd, yyyy')}`
    } else if (selectedRange.start) {
      return format(selectedRange.start, 'MMM dd, yyyy')
    } else {
      return 'Select a date range'
    }
  }

  const canSaveNote = () => {
    if (noteType === 'month') {
      return currentNote.trim() !== ''
    } else {
      return selectedRange.start && selectedRange.end && currentNote.trim() !== ''
    }
  }

  const saveNote = () => {
    if (!canSaveNote()) return

    const newNote = {
      id: Date.now().toString(),
      date: noteType === 'month' ? format(currentMonth, 'yyyy-MM') : format(selectedRange.start!, 'yyyy-MM-dd'),
      content: currentNote.trim(),
      type: noteType,
      ...(noteType === 'range' && {
        startDate: format(selectedRange.start!, 'yyyy-MM-dd'),
        endDate: format(selectedRange.end!, 'yyyy-MM-dd')
      })
    }

    console.log('Saving note:', newNote)
    setNotes([...notes, newNote])
    setCurrentNote('')
    console.log('Notes after save:', [...notes, newNote])
  }

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId))
  }

  const getNotesForCurrentTarget = () => {
    if (noteType === 'month') {
      return notes.filter(note => 
        note.type === 'month' && 
        format(new Date(note.date + '-01'), 'yyyy-MM') === format(currentMonth, 'yyyy-MM')
      )
    } else if (noteType === 'range') {
      return notes.filter(note => 
        note.type === 'range' && 
        selectedRange.start && selectedRange.end &&
        note.startDate === format(selectedRange.start, 'yyyy-MM-dd') &&
        note.endDate === format(selectedRange.end, 'yyyy-MM-dd')
      )
    } else if (noteType === 'date' && selectedRange.start) {
      return notes.filter(note => 
        note.type === 'date' && 
        note.date === format(selectedRange.start, 'yyyy-MM-dd')
      )
    }
    return []
  }

  const getAllNotes = () => {
    return notes.sort((a, b) => {
      // Sort by date (most recent first)
      const dateA = a.type === 'month' ? a.date : a.startDate
      const dateB = b.type === 'month' ? b.date : b.startDate
      return dateB.localeCompare(dateA)
    })
  }

  const currentTargetNotes = getNotesForCurrentTarget()
  const allNotes = getAllNotes()

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <StickyNote className="w-6 h-6 mr-2" style={{ color: extractedColors.secondary }} />
          Notes
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setNoteType('month')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
              noteType === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-white/20 text-white'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-1" />
            Month
          </button>
          <button
            onClick={() => setNoteType('range')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
              noteType === 'range'
                ? 'bg-blue-500 text-white'
                : 'bg-white/20 text-white'
            }`}
          >
            Range
          </button>
        </div>
      </div>

      {/* Note Input */}
      <div className="mb-6">
        <div className="mb-2">
          <span className="text-sm text-white/80">
            Adding note for: <strong className="text-white">{getTargetDescription()}</strong>
          </span>
        </div>
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Write your notes here..."
          className="w-full p-3 border border-white/20 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 text-white placeholder-white/60"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={saveNote}
            disabled={!canSaveNote()}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              canSaveNote()
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save Note</span>
          </button>
        </div>
      </div>

      {/* Current Target Notes */}
      {currentTargetNotes.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">
            Notes for {getTargetDescription()}
          </h4>
          <div className="space-y-2">
            {currentTargetNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-white/10 rounded-lg border border-white/20"
              >
                <p className="text-white mb-2">{note.content}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Notes */}
      {allNotes.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">
            All Notes ({allNotes.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-white/10 rounded-lg border border-white/20"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-white/60">
                    {note.type === 'month' 
                      ? format(new Date(note.date + '-01'), 'MMMM yyyy')
                      : `${format(new Date(note.startDate), 'MMM dd')} - ${format(new Date(note.endDate), 'MMM dd, yyyy')}`
                    }
                  </span>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-white text-sm">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {allNotes.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No notes yet. Start by adding a note above!</p>
        </div>
      )}
    </div>
  )
}
