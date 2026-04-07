'use client'

import { useEffect, useRef } from 'react'

interface PageFlipSoundProps {
  isFlipping: boolean
  flipDirection: 'next' | 'prev' | null
}

export default function PageFlipSound({ isFlipping, flipDirection }: PageFlipSoundProps) {
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Initialize Web Audio API for sound effects
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [])

  useEffect(() => {
    if (isFlipping && flipDirection && audioContextRef.current) {
      playPageFlipSound(flipDirection)
    }
  }, [isFlipping, flipDirection])

  const playPageFlipSound = (direction: 'next' | 'prev') => {
    if (!audioContextRef.current) return

    const audioContext = audioContextRef.current
    const duration = 0.8
    
    // Create oscillator for paper rustle sound
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()

    // Configure for paper-like sound
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(
      direction === 'next' ? 200 : 180, 
      audioContext.currentTime
    )
    oscillator.frequency.exponentialRampToValueAtTime(
      direction === 'next' ? 80 : 60, 
      audioContext.currentTime + duration * 0.3
    )

    // Filter for paper texture
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, audioContext.currentTime)
    filter.Q.setValueAtTime(2, audioContext.currentTime)

    // Gain envelope for realistic paper sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    // Connect nodes
    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Play sound
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)

    // Add subtle page turn whoosh
    setTimeout(() => {
      playWhooshSound(direction)
    }, 100)
  }

  const playWhooshSound = (direction: 'next' | 'prev') => {
    if (!audioContextRef.current) return

    const audioContext = audioContextRef.current
    const duration = 0.4
    
    // Create noise for whoosh effect
    const bufferSize = audioContext.sampleRate * duration
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() - 0.5) * 0.1
    }

    const noiseSource = audioContext.createBufferSource()
    const gainNode = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()

    noiseSource.buffer = buffer

    // Filter for whoosh
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1000, audioContext.currentTime)
    filter.frequency.exponentialRampToValueAtTime(
      200, 
      audioContext.currentTime + duration
    )

    // Whoosh envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    // Connect nodes
    noiseSource.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Play whoosh
    noiseSource.start(audioContext.currentTime)
    noiseSource.stop(audioContext.currentTime + duration)
  }

  return null // This component doesn't render anything visible
}
