import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Doodle from './Doodle.jsx'

// A physical-looking envelope. Clicking plays a small opening animation
// (flap lifts, letter peeks out) before navigating to the memory page.

const STAMP_DOODLE = {
  disco: 'disco',
  taiwan: 'sparkle',
  cake: 'cake',
  cat: 'smiley',
  flower: 'flower',
  sun: 'littlesun',
  mic: 'mic',
  leaf: 'flower',
  flame: 'twinflame',
  book: 'book',
  newspaper: 'newspaper',
}

export default function Envelope({ person, opened, onOpen, index = 0 }) {
  const { name, envelope, accent } = person
  const [animating, setAnimating] = useState(false)
  const reduce = useReducedMotion()
  const nameFont = index % 3 === 1 ? 'var(--font-hand-2)' : 'var(--font-hand)'

  const handleClick = () => {
    if (animating) return
    if (reduce) {
      onOpen()
      return
    }
    setAnimating(true)
    setTimeout(onOpen, 620)
  }

  const flapOpen = opened || animating

  return (
    <motion.button
      onClick={handleClick}
      aria-label={`open ${name}'s letter${opened ? ' (already opened)' : ''}`}
      initial={reduce ? false : { opacity: 0, y: 24, rotate: envelope.rotation - 3 }}
      animate={{ opacity: 1, y: 0, rotate: envelope.rotation }}
      transition={{ delay: 0.06 * index, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        reduce
          ? undefined
          : { y: -7, rotate: envelope.rotation * 0.55, scale: 1.03, zIndex: 5 }
      }
      whileTap={reduce ? undefined : { scale: 0.97 }}
      className="envelope-btn"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 250,
        aspectRatio: '25 / 16.5',
        filter: 'drop-shadow(0 4px 6px rgba(90,62,54,0.16))',
      }}
    >
      {/* liner visible behind the flap when open */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: '52%',
          background: envelope.liner,
          borderRadius: '6px 6px 0 0',
          backgroundImage:
            'repeating-linear-gradient(-45deg, rgba(255,255,255,0.35) 0 7px, transparent 7px 14px)',
        }}
      />

      {/* the letter peeking out while opening */}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={
          animating && !reduce
            ? { y: '-46%', opacity: 1 }
            : { y: '-4%', opacity: flapOpen ? 1 : 0 }
        }
        transition={{ duration: 0.45, delay: animating ? 0.18 : 0, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: '9%',
          right: '9%',
          top: '8%',
          height: '78%',
          background: 'var(--card)',
          borderRadius: 3,
          boxShadow: '0 -1px 6px rgba(90,62,54,0.12)',
          backgroundImage:
            'repeating-linear-gradient(transparent 0 12px, rgba(90,62,54,0.1) 12px 13px)',
          backgroundPosition: '0 22px',
          backgroundSize: '68% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundClip: 'content-box',
          padding: '18px 14%',
        }}
      />

      {/* flap */}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{
          rotateX: flapOpen ? 178 : 0,
          zIndex: flapOpen ? 0 : 3,
        }}
        transition={{ duration: reduce ? 0 : 0.4, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: '54%',
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          background: `color-mix(in srgb, ${envelope.color} 82%, #a08468 18%)`,
          clipPath: 'polygon(0 0, 100% 0, 51% 96%)',
          borderRadius: '6px 6px 0 0',
        }}
      />

      {/* envelope body: side + bottom folds */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 6,
          background: envelope.color,
          clipPath:
            'polygon(0 0, 6% 0, 50% 46%, 94% 0, 100% 0, 100% 100%, 0 100%)',
        }}
      />
      {/* fold creases */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 6,
          background:
            'linear-gradient(115deg, rgba(90,62,54,0.07) 0%, transparent 28%), linear-gradient(-115deg, rgba(90,62,54,0.07) 0%, transparent 28%)',
          clipPath:
            'polygon(0 0, 6% 0, 50% 46%, 94% 0, 100% 0, 100% 100%, 0 100%)',
        }}
      />

      {/* handwritten name */}
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '52%',
          textAlign: 'center',
          fontFamily: nameFont,
          fontSize: nameFont === 'var(--font-hand-2)' ? '1.35rem' : '1.6rem',
          fontWeight: 600,
          color: 'var(--ink)',
          zIndex: 4,
          transform: `translateY(-30%) rotate(${index % 2 ? -1.5 : 1.2}deg)`,
          textShadow: '0 1px 0 rgba(255,255,255,0.4)',
        }}
      >
        {name}
      </span>

      {/* postage stamp */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '7%',
          right: '5%',
          width: 40,
          height: 46,
          background: 'var(--card)',
          border: `1.5px dashed color-mix(in srgb, ${accent} 55%, transparent)`,
          borderRadius: 2,
          zIndex: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotate(${index % 2 ? 4 : -3}deg)`,
        }}
      >
        <Doodle kind={STAMP_DOODLE[envelope.stamp] || 'heart'} size={26} color={accent} />
      </span>
      {/* postmark ring */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '4%',
          right: '16%',
          width: 34,
          height: 34,
          border: '1.5px solid rgba(90,62,54,0.22)',
          borderRadius: '50%',
          zIndex: 5,
          transform: 'rotate(-8deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-hand)',
          fontSize: '0.55rem',
          color: 'rgba(90,62,54,0.4)',
          textTransform: 'lowercase',
        }}
      >
        with love
      </span>

      {/* small doodle bottom-left */}
      <span aria-hidden="true" style={{ position: 'absolute', bottom: '9%', left: '6%', zIndex: 4, opacity: 0.75 }}>
        <Doodle kind={envelope.doodle} size={22} color={accent} />
      </span>

      {/* opened indicator */}
      {opened && (
        <span
          aria-hidden="true"
          className="hand"
          style={{
            position: 'absolute',
            bottom: '8%',
            right: '6%',
            zIndex: 4,
            fontSize: '0.92rem',
            color: 'var(--rose-deep)',
            border: '1.4px solid color-mix(in srgb, var(--rose-deep) 55%, transparent)',
            borderRadius: 999,
            padding: '1px 9px 2px',
            transform: 'rotate(-6deg)',
            background: 'rgba(255,253,247,0.75)',
          }}
        >
          opened ♡
        </span>
      )}
    </motion.button>
  )
}
