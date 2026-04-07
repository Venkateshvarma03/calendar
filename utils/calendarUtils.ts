// Utility functions for theme extraction from images
export interface ExtractedColors {
  primary: string
  secondary: string
  accent: string
}

// Simple color extraction from image
export const extractColorsFromImage = (imageUrl: string): Promise<ExtractedColors> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        resolve({ primary: '#3B82F6', secondary: '#10B981', accent: '#F59E0B' })
        return
      }
      
      // Resize image for faster processing
      const scaleFactor = 50 / Math.max(img.width, img.height)
      canvas.width = img.width * scaleFactor
      canvas.height = img.height * scaleFactor
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      // Simple color extraction - find dominant colors
      const colorMap: { [key: string]: number } = {}
      
      for (let i = 0; i < data.length; i += 4) {
        const r = Math.floor(data[i] / 32) * 32
        const g = Math.floor(data[i + 1] / 32) * 32
        const b = Math.floor(data[i + 2] / 32) * 32
        const key = `${r},${g},${b}`
        
        colorMap[key] = (colorMap[key] || 0) + 1
      }
      
      // Sort colors by frequency
      const sortedColors = Object.entries(colorMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([color]) => {
          const [r, g, b] = color.split(',').map(Number)
          return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
        })
      
      resolve({
        primary: sortedColors[0] || '#3B82F6',
        secondary: sortedColors[1] || '#10B981',
        accent: sortedColors[2] || '#F59E0B'
      })
    }
    
    img.onerror = () => {
      resolve({ primary: '#3B82F6', secondary: '#10B981', accent: '#F59E0B' })
    }
    
    img.src = imageUrl
  })
}

// Helper function to get contrast color
export const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

// Drag selection utilities
export const getDaysBetween = (startDate: Date, endDate: Date): Date[] => {
  const days: Date[] = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  
  return days
}

// Check if a date is in a weekend
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6
}

// Format date range for display
export const formatDateRange = (start: Date, end: Date): string => {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  const sameDay = start.getDate() === end.getDate()
  
  if (sameDay) {
    return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  if (sameMonth) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}
