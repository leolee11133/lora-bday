import { useEffect, useRef } from 'react'

// A very light cursor-trail: occasionally leaves a tiny heart/star behind the
// pointer on desktop. Pure DOM (no React re-renders), disabled on touch
// devices and under prefers-reduced-motion.

const GLYPHS = ['♡', '✦', '✧', '♡', '·']
const COLORS = ['#c98a9a', '#b8a3d6', '#8aa16f', '#d9a441', '#7d9db3']

export default function SparkleCursor() {
  const containerRef = useRef(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduced) return

    const container = document.createElement('div')
    container.setAttribute('aria-hidden', 'true')
    Object.assign(container.style, {
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 95,
      overflow: 'hidden',
    })
    document.body.appendChild(container)
    containerRef.current = container

    let last = 0
    const spawn = (x, y, big = false) => {
      const el = document.createElement('span')
      el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      const size = big ? 15 + Math.random() * 8 : 9 + Math.random() * 6
      Object.assign(el.style, {
        position: 'absolute',
        left: `${x + (Math.random() * 18 - 9)}px`,
        top: `${y + (Math.random() * 18 - 9)}px`,
        fontSize: `${size}px`,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: '0.9',
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.9s ease-out, transform 0.9s ease-out',
        willChange: 'transform, opacity',
        fontFamily: 'serif',
      })
      container.appendChild(el)
      requestAnimationFrame(() => {
        el.style.opacity = '0'
        el.style.transform = `translate(-50%, -50%) translateY(${12 + Math.random() * 14}px) rotate(${Math.random() * 50 - 25}deg)`
      })
      setTimeout(() => el.remove(), 950)
    }

    const onMove = (e) => {
      const now = performance.now()
      if (now - last < 140) return // sparse: at most ~7 per second
      last = now
      if (Math.random() < 0.5) spawn(e.clientX, e.clientY)
    }
    const onClick = (e) => {
      for (let i = 0; i < 3; i++) spawn(e.clientX, e.clientY, true)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onClick, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onClick)
      container.remove()
    }
  }, [])

  return null
}
