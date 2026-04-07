'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'

export default function VoiceCommands() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setIsSupported(true)
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const last = event.results.length - 1
        const command = event.results[last][0].transcript.toLowerCase()
        setTranscript(command)
        processCommand(command)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const processCommand = (command: string) => {
    // Process voice commands
    if (command.includes('next month') || command.includes('next')) {
      // Trigger next month
      window.dispatchEvent(new CustomEvent('voiceCommand', { detail: 'nextMonth' }))
    } else if (command.includes('previous month') || command.includes('previous') || command.includes('back')) {
      // Trigger previous month
      window.dispatchEvent(new CustomEvent('voiceCommand', { detail: 'previousMonth' }))
    } else if (command.includes('today') || command.includes('current')) {
      // Go to today
      window.dispatchEvent(new CustomEvent('voiceCommand', { detail: 'today' }))
    } else if (command.includes('fullscreen') || command.includes('full screen')) {
      // Toggle fullscreen
      window.dispatchEvent(new CustomEvent('voiceCommand', { detail: 'toggleFullscreen' }))
    } else if (command.includes('dark mode') || command.includes('dark')) {
      // Toggle dark mode
      window.dispatchEvent(new CustomEvent('voiceCommand', { detail: 'toggleDarkMode' }))
    }
  }

  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      setTranscript('')
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <>
      <button
        onClick={toggleListening}
        className={`voice-indicator ${isListening ? 'bg-red-500' : 'bg-gray-500'} hover:bg-red-600 transition-colors`}
        title={isListening ? 'Stop listening' : 'Start voice commands'}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>
      
      {isListening && (
        <div className="absolute bottom-16 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <div className="flex items-center space-x-2 mb-2">
            <Volume2 className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-sm font-semibold">Listening...</span>
          </div>
          <div className="text-xs text-gray-600">
            Say: "next month", "previous", "today", "fullscreen", "dark mode"
          </div>
          {transcript && (
            <div className="mt-2 text-xs text-gray-800 italic">
              "{transcript}"
            </div>
          )}
        </div>
      )}
    </>
  )
}
