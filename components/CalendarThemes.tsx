'use client'

import { useState } from 'react'
import { Palette, Sun, Moon, Mountain, Waves, Trees } from 'lucide-react'

export interface CalendarTheme {
  id: string
  name: string
  icon: any
  heroImage: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  gradient: string
}

const predefinedThemes: CalendarTheme[] = [
  {
    id: 'mountain',
    name: 'Mountain Adventure',
    icon: Mountain,
    heroImage: 'https://picsum.photos/seed/mountain-adventure/800/400.jpg',
    colors: {
      primary: '#1E40AF',
      secondary: '#7C3AED',
      accent: '#F59E0B',
      background: '#F3F4F6',
      text: '#1F2937'
    },
    gradient: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)'
  },
  {
    id: 'beach',
    name: 'Beach Paradise',
    icon: Waves,
    heroImage: 'https://picsum.photos/seed/beach-paradise/800/400.jpg',
    colors: {
      primary: '#0891B2',
      secondary: '#06B6D4',
      accent: '#F97316',
      background: '#FEF3C7',
      text: '#92400E'
    },
    gradient: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)'
  },
  {
    id: 'forest',
    name: 'Forest Serenity',
    icon: Trees,
    heroImage: 'https://picsum.photos/seed/forest-serenity/800/400.jpg',
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#84CC16',
      background: '#F0FDF4',
      text: '#14532D'
    },
    gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    icon: Moon,
    heroImage: 'https://picsum.photos/seed/dark-mode/800/400.jpg',
    colors: {
      primary: '#8B5CF6',
      secondary: '#6366F1',
      accent: '#EC4899',
      background: '#1F2937',
      text: '#F9FAFB'
    },
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)'
  },
  {
    id: 'light',
    name: 'Light Mode',
    icon: Sun,
    heroImage: 'https://picsum.photos/seed/light-mode/800/400.jpg',
    colors: {
      primary: '#3B82F6',
      secondary: '#0EA5E9',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937'
    },
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%)'
  }
]

export default function CalendarThemes({ 
  currentTheme, 
  onThemeChange 
}: {
  currentTheme: CalendarTheme
  onThemeChange: (theme: CalendarTheme) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeSelect = (theme: CalendarTheme) => {
    onThemeChange(theme)
    setIsOpen(false)
    
    // Apply theme colors to CSS variables
    const root = document.documentElement
    root.style.setProperty('--theme-primary', theme.colors.primary)
    root.style.setProperty('--theme-secondary', theme.colors.secondary)
    root.style.setProperty('--theme-accent', theme.colors.accent)
    root.style.setProperty('--theme-background', theme.colors.background)
    root.style.setProperty('--theme-text', theme.colors.text)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200"
      >
        <Palette className="w-5 h-5 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">Themes</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Calendar Themes</h3>
            <div className="space-y-2">
              {predefinedThemes.map((theme) => {
                const Icon = theme.icon
                return (
                  <div
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme)}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentTheme.id === theme.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: theme.gradient }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{theme.name}</h4>
                      <div className="flex space-x-1 mt-1">
                        {Object.values(theme.colors).slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    {currentTheme.id === theme.id && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { predefinedThemes }
