'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function makeRng(seed: number) {
  let s = seed
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
}

const rng = makeRng(8472)

const STARS = Array.from({ length: 88 }, (_, id) => {
  const angle = rng() * Math.PI * 2
  const radius = Math.sqrt(rng()) * 178
  return {
    id,
    cx: Math.round((200 + radius * Math.cos(angle)) * 100) / 100,
    cy: Math.round((200 + radius * Math.sin(angle)) * 100) / 100,
    r: Math.round((rng() * 2.2 + 0.4) * 10) / 10,
    opacity: Math.round((rng() * 0.65 + 0.25) * 100) / 100,
  }
})

const CONNECTIONS: [number, number][] = []
for (let i = 0; i < STARS.length && CONNECTIONS.length < 50; i++) {
  for (let j = i + 1; j < STARS.length && CONNECTIONS.length < 50; j++) {
    const dx = STARS[i].cx - STARS[j].cx
    const dy = STARS[i].cy - STARS[j].cy
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d > 6 && d < 30) CONNECTIONS.push([i, j])
  }
}

const GRID_LINES = Array.from({ length: 12 }, (_, i) => {
  const rad = (i * 30 * Math.PI) / 180
  return {
    deg: i * 30,
    x1: Math.round((200 + 192 * Math.cos(rad)) * 100) / 100,
    y1: Math.round((200 + 192 * Math.sin(rad)) * 100) / 100,
    x2: Math.round((200 - 192 * Math.cos(rad)) * 100) / 100,
    y2: Math.round((200 - 192 * Math.sin(rad)) * 100) / 100,
  }
})

export default function ZodiacFlash({ onComplete }: { onComplete: () => void }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(onComplete, 6200)
    return () => clearTimeout(t)
  }, [onComplete])

  if (!mounted) return null

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 6, times: [0, 0.167, 1], ease: 'easeInOut' }}
    >
      <svg
        viewBox="0 0 400 400"
        style={{
          width: 'min(94vw, 94vh)',
          height: 'min(94vw, 94vh)',
          filter:
            'drop-shadow(0 0 6px rgba(255,255,255,1)) drop-shadow(0 0 18px rgba(255,255,255,0.85)) drop-shadow(0 0 40px rgba(255,255,255,0.6)) drop-shadow(0 0 70px rgba(255,255,255,0.35))',
        }}
      >
        <defs>
          <clipPath id="star-clip">
            <circle cx={200} cy={200} r={184} />
          </clipPath>
        </defs>

        {/* Outer double ring */}
        <circle cx={200} cy={200} r={192} stroke="white" strokeWidth="2" fill="none" />
        <circle cx={200} cy={200} r={184} stroke="white" strokeWidth="0.7" fill="none" opacity="0.55" />

        <g clipPath="url(#star-clip)">
          {/* Concentric declination circles */}
          {[152, 118, 86, 56, 28].map((r) => (
            <circle key={r} cx={200} cy={200} r={r}
              stroke="white" strokeWidth="0.5" fill="none" opacity="0.15" />
          ))}

          {/* Grid lines (12 directions through center) */}
          {GRID_LINES.map(({ deg, x1, y1, x2, y2 }) => (
            <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="white"
              strokeWidth={deg % 90 === 0 ? 0.9 : 0.4}
              opacity={deg % 90 === 0 ? 0.55 : 0.25}
            />
          ))}

          {/* Constellation lines */}
          {CONNECTIONS.map(([i, j], idx) => (
            <line key={idx}
              x1={STARS[i].cx} y1={STARS[i].cy}
              x2={STARS[j].cx} y2={STARS[j].cy}
              stroke="white" strokeWidth="0.35" opacity="0.28"
            />
          ))}

          {/* Stars */}
          {STARS.map((s) => (
            <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.opacity} />
          ))}
        </g>

        {/* Center dot */}
        <circle cx={200} cy={200} r={2} fill="white" opacity="0.8" />
      </svg>
    </motion.div>
  )
}
