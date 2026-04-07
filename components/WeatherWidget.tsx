'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react'

interface WeatherData {
  temperature: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy'
  humidity: number
  windSpeed: number
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 72,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 8
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate weather data fetching
    const fetchWeather = () => {
      setLoading(true)
      setTimeout(() => {
        const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'windy']
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
        
        setWeather({
          temperature: Math.floor(Math.random() * 30) + 60,
          condition: randomCondition,
          humidity: Math.floor(Math.random() * 40) + 40,
          windSpeed: Math.floor(Math.random() * 20) + 5
        })
        setLoading(false)
      }, 1000)
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-yellow-500" />
      case 'cloudy':
        return <Cloud className="w-6 h-6 text-gray-500" />
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-500" />
      case 'windy':
        return <Wind className="w-6 h-6 text-gray-400" />
      default:
        return <Sun className="w-6 h-6 text-yellow-500" />
    }
  }

  const getWeatherBackground = () => {
    switch (weather.condition) {
      case 'sunny':
        return 'bg-gradient-to-br from-yellow-100 to-orange-100'
      case 'cloudy':
        return 'bg-gradient-to-br from-gray-100 to-gray-200'
      case 'rainy':
        return 'bg-gradient-to-br from-blue-100 to-blue-200'
      case 'windy':
        return 'bg-gradient-to-br from-teal-100 to-cyan-100'
      default:
        return 'bg-gradient-to-br from-yellow-100 to-orange-100'
    }
  }

  if (loading) {
    return (
      <div className="weather-widget">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-12"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`weather-widget ${getWeatherBackground()}`}>
      <div className="flex items-center space-x-3">
        {getWeatherIcon()}
        <div>
          <div className="flex items-center space-x-1">
            <Thermometer className="w-4 h-4 text-gray-600" />
            <span className="text-lg font-semibold text-gray-800">{weather.temperature}°F</span>
          </div>
          <div className="text-xs text-gray-600 capitalize">{weather.condition}</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-600">
        <div>Humidity: {weather.humidity}%</div>
        <div>Wind: {weather.windSpeed} mph</div>
      </div>
    </div>
  )
}
