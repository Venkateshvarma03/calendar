'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface WallCalendarFlipProps {
  currentMonth: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  children: React.ReactNode
  isFlipping: boolean
}

export default function WallCalendarFlip({ 
  currentMonth, 
  onPreviousMonth, 
  onNextMonth, 
  children, 
  isFlipping 
}: WallCalendarFlipProps) {
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null)
  const [showBackPage, setShowBackPage] = useState(false)
  const [pageStack, setPageStack] = useState<number[]>([1, 2, 3, 4, 5])

  useEffect(() => {
    if (isFlipping) {
      // Determine flip direction based on which button was clicked
      // This will be set by the parent component
      setShowBackPage(true)
      
      // Reset after animation
      setTimeout(() => {
        setShowBackPage(false)
        setFlipDirection(null)
      }, 1200)
    }
  }, [isFlipping])

  const handlePreviousMonth = () => {
    setFlipDirection('prev')
    onPreviousMonth()
  }

  const handleNextMonth = () => {
    setFlipDirection('next')
    onNextMonth()
  }

  return (
    <div className="relative w-full h-full" style={{ perspective: '2000px' }}>
      {/* Calendar Stack Visualization */}
      <div className="absolute inset-0 pointer-events-none">
        {pageStack.slice(0, 3).map((page, index) => (
          <div
            key={page}
            className="absolute inset-0 bg-white rounded-lg shadow-xl"
            style={{
              transform: `translateZ(${-index * 2}px) translateY(${index * 1}px) translateX(${index * 0.5}px)`,
              opacity: 1 - (index * 0.1),
              zIndex: 10 - index
            }}
          />
        ))}
      </div>

      {/* Main Calendar Page */}
      <div 
        className={`relative transition-all duration-700 ease-in-out ${isFlipping ? 'pointer-events-none' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipping && flipDirection === 'next' 
            ? 'rotateY(-180deg)' 
            : isFlipping && flipDirection === 'prev'
            ? 'rotateY(180deg)'
            : 'rotateY(0deg)',
          transition: isFlipping ? 'transform 1.2s cubic-bezier(0.4, 0.0, 0.2, 1)' : 'none'
        }}
      >
        {/* Front of Calendar Page */}
        <div 
          className="relative w-full h-full"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
        >
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4 z-20 pointer-events-none">
            <button
              onClick={handlePreviousMonth}
              disabled={isFlipping}
              className="pointer-events-auto p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ transform: 'translateZ(50px)' }}
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={handleNextMonth}
              disabled={isFlipping}
              className="pointer-events-auto p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ transform: 'translateZ(50px)' }}
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Calendar Content */}
          <div className="w-full h-full">
            {children}
          </div>

          {/* Page Edge Shadow */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 1%, rgba(0,0,0,0.05) 5%, transparent 100%)'
            }}
          />
        </div>

        {/* Back of Calendar Page (shows during flip) */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
          }}
        >
          {/* Back page content - shows a simple calendar view */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-300 mb-4">
                {currentMonth.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
              </div>
              <div className="text-4xl text-gray-400">
                {currentMonth.getFullYear()}
              </div>
              {/* Calendar grid on back */}
              <div className="mt-8 grid grid-cols-7 gap-1 text-xs text-gray-400">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="w-6 h-6 flex items-center justify-center">
                    {day}
                  </div>
                ))}
                {/* Empty cells and date numbers */}
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="w-6 h-6 flex items-center justify-center">
                    {i > 4 && i <= 35 ? (i - 4) : ''}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Back page shadow */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.1) 1%, rgba(0,0,0,0.05) 5%, transparent 100%)'
            }}
          />
        </div>
      </div>

      {/* Page Flip Sound Effect (visual indicator) */}
      {isFlipping && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
          Flipping page...
        </div>
      )}

      {/* Page curl effect */}
      <div 
        className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
          transform: isFlipping ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.3s ease'
        }}
      />
    </div>
  )
}
