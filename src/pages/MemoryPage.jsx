import { useMemo, useState } from 'react'
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import manifest from '../data/photoManifest.json'
import { personBySlug } from '../data/people.js'
import { seededRandom, range } from '../lib/random.js'
import { asset } from '../lib/asset.js'
import PageTransition from '../components/PageTransition.jsx'
import Polaroid from '../components/Polaroid.jsx'
import Lightbox from '../components/Lightbox.jsx'
import Doodle from '../components/Doodle.jsx'
import './pages.css'

const NOTE_POOL = [
  'core memory',
  'hehe',
  'love you',
  'our lore',
  '<3',
  'forever type friendship',
  'proof we survived',
  'some things never change',
  'iconic',
  'another episode...',
]

// vertical tape strips; displayed small and rotated across a corner
const TAPES = ['/decorations/tape-white-1.png', '/decorations/tape-white-2.png']

export default function MemoryPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const person = personBySlug(slug)
  const reduce = useReducedMotion()
  const [lightbox, setLightbox] = useState(null)

  const photos = useMemo(() => {
    const list = manifest[slug] || []
    // always render at least 4 frames so empty folders still look loved
    if (list.length === 0) return [null, null, null, null]
    return list.map(asset)
  }, [slug])

  const layout = useMemo(() => {
    if (!person) return []
    const rand = seededRandom(person.slug)
    const items = []
    const notes = [...person.captions]
    const pool = [...NOTE_POOL]
    const base = photos.length <= 4 ? 205 : 170
    photos.forEach((src, i) => {
      items.push({
        type: 'photo',
        src,
        rotation: range(rand, -7, 7),
        width: base + Math.round(range(rand, 0, 70)),
        aspect: range(rand, 0.9, 1.2),
        tape: rand() < 0.55 ? asset(TAPES[Math.floor(rand() * TAPES.length)]) : null,
        clip: i === 1 && rand() < 0.7,
        caption:
          rand() < 0.4
            ? pool.splice(Math.floor(rand() * pool.length), 1)[0]
            : undefined,
      })
      // interleave handwritten notes between photos
      if ((i === 0 || i === 2 || i === 4) && notes.length) {
        items.push({
          type: 'note',
          text: notes.shift(),
          rotation: range(rand, -6, 6),
          doodle: ['heart', 'star', 'sparkle', 'flower'][Math.floor(rand() * 4)],
        })
      }
    })
    while (notes.length) {
      items.push({ type: 'note', text: notes.shift(), rotation: range(rand, -6, 6), doodle: 'heart' })
    }
    return items
  }, [person, photos])

  if (!person) return <Navigate to="/letters" replace />

  const isFamily = person.family
  const heading = person.pageTitle || `Lora + ${person.name} ♡`

  return (
    <PageTransition
      style={
        isFamily
          ? {
              background:
                'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(243, 227, 207, 0.55), transparent 70%)',
            }
          : undefined
      }
    >
      <Link to="/letters" className="back-link">
        ← all the letters
      </Link>

      <div className="memory-page">
        <h1 className="memory-heading">{heading}</h1>
        <p className="memory-subheading">
          {person.pageSubtitle || `memories with ${person.name}`}
        </p>

        <div className="memory-collage">
          {layout.map((item, i) =>
            item.type === 'photo' ? (
              <motion.button
                key={i}
                className="polaroid-btn"
                onClick={() =>
                  item.src &&
                  setLightbox({
                    src: item.src,
                    alt: `Lora and ${person.name}`,
                    caption: item.caption,
                  })
                }
                aria-label={
                  item.src ? `enlarge photo of Lora and ${person.name}` : 'photo placeholder'
                }
                initial={reduce ? false : { opacity: 0, y: 28, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'relative' }}
              >
                <Polaroid
                  src={item.src}
                  alt={`Lora and ${person.name}`}
                  caption={item.caption}
                  rotation={item.rotation}
                  width={item.width}
                  aspect={item.aspect}
                  folder={`public/photos/${person.slug}/`}
                  eager={i < 3}
                />
                {item.tape && (
                  <img
                    src={item.tape}
                    alt=""
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: -20,
                      left: item.rotation > 0 ? -14 : undefined,
                      right: item.rotation > 0 ? undefined : -14,
                      width: 22,
                      transform: `rotate(${item.rotation > 0 ? -48 : 47}deg)`,
                      transformOrigin: 'center 30px',
                      opacity: 0.8,
                      pointerEvents: 'none',
                      zIndex: 3,
                    }}
                  />
                )}
                {item.clip && (
                  <img
                    src={asset('/decorations/paperclip.png')}
                    alt=""
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: -14,
                      left: 12,
                      width: 17,
                      transform: 'rotate(12deg)',
                      pointerEvents: 'none',
                      zIndex: 3,
                    }}
                  />
                )}
              </motion.button>
            ) : (
              <motion.span
                key={i}
                className="collage-note"
                style={{ transform: `rotate(${item.rotation}deg)` }}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <Doodle kind={item.doodle} size={20} color={person.accent} />
                {item.text}
              </motion.span>
            )
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 46 }}>
          <button
            className="read-letter-btn"
            onClick={() => navigate(`/person/${person.slug}/letter`)}
          >
            read their letter <span aria-hidden="true">💌</span>
          </button>
        </div>
      </div>

      <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />
    </PageTransition>
  )
}
