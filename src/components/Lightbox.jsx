import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export default function Lightbox({ photo, onClose }) {
  const closeRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!photo) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [photo, onClose])

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(56, 40, 34, 0.55)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <motion.figure
            initial={reduce ? { opacity: 0 } : { scale: 0.88, rotate: -2, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--card)',
              padding: 'clamp(10px, 2vw, 16px)',
              paddingBottom: 'clamp(40px, 6vw, 54px)',
              boxShadow: 'var(--shadow-lift)',
              borderRadius: 3,
              maxWidth: 'min(92vw, 640px)',
              maxHeight: '88dvh',
              position: 'relative',
            }}
          >
            <span className="tape" style={{ top: -12, left: '50%', transform: 'translateX(-50%) rotate(-2deg)' }} />
            <img
              src={photo.src}
              alt={photo.alt}
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(88dvh - 110px)',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            {photo.caption && (
              <figcaption
                className="hand"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 10,
                  textAlign: 'center',
                  fontSize: '1.25rem',
                  color: 'var(--ink-soft)',
                }}
              >
                {photo.caption}
              </figcaption>
            )}
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="close photo"
              className="hand"
              style={{
                position: 'absolute',
                top: -14,
                right: -12,
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'var(--card)',
                boxShadow: 'var(--shadow-soft)',
                fontSize: '1.15rem',
                color: 'var(--ink-soft)',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
