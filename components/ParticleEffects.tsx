'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

interface ParticleEffectsProps {
  trigger: boolean
  count?: number
}

export default function ParticleEffects({ trigger, count = 20 }: ParticleEffectsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    if (!trigger || !containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    // Generate particles
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 2 + 2,
        delay: Math.random() * 0.5
      })
    }

    particlesRef.current = newParticles

    // Create particle elements
    newParticles.forEach((particle) => {
      const element = document.createElement('div')
      element.className = 'particle'
      element.style.left = `${particle.x}px`
      element.style.top = `${particle.y}px`
      element.style.width = `${particle.size}px`
      element.style.height = `${particle.size}px`
      element.style.animationDelay = `${particle.delay}s`
      element.style.animationDuration = `${particle.duration}s`
      
      container.appendChild(element)

      // Remove particle after animation
      setTimeout(() => {
        element.remove()
      }, (particle.delay + particle.duration) * 1000)
    })

    return () => {
      // Cleanup particles
      const particles = container.querySelectorAll('.particle')
      particles.forEach(particle => particle.remove())
    }
  }, [trigger, count])

  return (
    <div ref={containerRef} className="particle-container" />
  )
}
