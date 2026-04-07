'use client'

import { useState } from 'react'

interface TooltipProps {
  text: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function Tooltip({ text, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
    }
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`tooltip absolute ${getPositionClasses()} whitespace-nowrap z-50`}>
          {text}
          <div className={`absolute ${position === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 -mt-1' : position === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1' : ''} w-2 h-2 bg-gray-800 transform rotate-45`}></div>
        </div>
      )}
    </div>
  )
}
