'use client'

import { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

export default function StarBackground({ haze = false }: { haze?: boolean }) {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const generated: Star[] = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 4,
    }))
    setStars(generated)
  }, [])

  return (
    <div
      className="fixed inset-0"
      style={{
        background: 'radial-gradient(ellipse at 50% 60%, #0d1b2a 0%, #04080f 100%)',
        filter: haze ? 'blur(3px) brightness(0.7)' : 'none',
        transition: 'filter 0.5s ease',
      }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'white',
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}
