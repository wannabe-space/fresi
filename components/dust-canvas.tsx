'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

interface DustCanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
  amount?: number
}

export function DustCanvas({ amount = 100, className, ...props }: DustCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!canvasRef.current)
      return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx)
      return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create initial particles
    const particles = Array.from({ length: amount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speedX: Math.random() * 0.2 - 0.1, // Reduced speed range
      speedY: Math.random() * 0.2 - 0.1, // Reduced speed range
      opacity: Math.random() * 0.5 + 0.1,
    }))

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Reset position if out of bounds
        if (particle.x < 0)
          particle.x = canvas.width
        if (particle.x > canvas.width)
          particle.x = 0
        if (particle.y < 0)
          particle.y = canvas.height
        if (particle.y > canvas.height)
          particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = resolvedTheme === 'light' ? `rgba(0, 0, 0, ${particle.opacity})` : `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [resolvedTheme, amount])

  return <canvas ref={canvasRef} className={className} {...props} />
}
