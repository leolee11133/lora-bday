import { useEffect, useRef, useState } from 'react'

// Tiny optional music control. Replace the song at:
//   public/audio/birthday-song.mp3
// Nothing autoplays; Lora has to press play herself.

const SRC = import.meta.env.BASE_URL + 'audio/birthday-song.mp3'

export default function MusicButton() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(true)
  const [hint, setHint] = useState(false)

  useEffect(() => {
    // check quietly whether the audio file exists so the control can hint
    fetch(SRC, { method: 'HEAD' })
      .then((r) => {
        const type = r.headers.get('content-type') || ''
        if (!r.ok || type.includes('text/html')) setAvailable(false)
      })
      .catch(() => setAvailable(false))
  }, [])

  const toggle = () => {
    if (!available) {
      setHint(true)
      setTimeout(() => setHint(false), 3200)
      return
    }
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setAvailable(false))
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'max(14px, env(safe-area-inset-bottom))',
        right: 14,
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 6,
      }}
    >
      {hint && (
        <span
          className="hand"
          style={{
            background: 'var(--card)',
            padding: '6px 12px',
            borderRadius: 12,
            boxShadow: 'var(--shadow-soft)',
            fontSize: '0.95rem',
            color: 'var(--ink-soft)',
            maxWidth: 220,
            textAlign: 'right',
          }}
        >
          add a song at public/audio/birthday-song.mp3 ♡
        </span>
      )}
      <button
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'pause our soundtrack' : 'play our soundtrack'}
        className="hand"
        style={{
          background: 'rgba(255, 253, 247, 0.85)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(90, 62, 54, 0.1)',
          borderRadius: 999,
          padding: '7px 15px 8px',
          fontSize: '1.05rem',
          color: playing ? 'var(--rose-deep)' : 'var(--ink-soft)',
          boxShadow: 'var(--shadow-soft)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          transition: 'color 0.25s ease, transform 0.25s ease',
        }}
      >
        <span aria-hidden="true" style={{ fontSize: '0.95rem' }}>
          {playing ? '♪' : '♫'}
        </span>
        our soundtrack
      </button>
      <audio ref={audioRef} src={SRC} loop preload="none" onEnded={() => setPlaying(false)} />
    </div>
  )
}
