import { useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import manifest from '../data/photoManifest.json'
import { people } from '../data/people.js'
import { asset } from '../lib/asset.js'
import PageTransition from '../components/PageTransition.jsx'
import Doodle from '../components/Doodle.jsx'
import Polaroid from '../components/Polaroid.jsx'
import heartBurst from '../components/HeartBurst.jsx'
import './pages.css'

// photo slots around the edge of the screen (percentages), center stays clear.
// mobile: true → also shown on phones.
const SLOTS = [
  { left: '-3%', top: '-4%', rot: -7, w: 175, mobile: true },
  { left: '16%', top: '2%', rot: 4, w: 150 },
  { left: '36%', top: '-6%', rot: -2, w: 160 },
  { left: '58%', top: '1%', rot: 6, w: 150 },
  { left: '78%', top: '-4%', rot: -5, w: 175, mobile: true },
  { left: '-5%', top: '26%', rot: 5, w: 165 },
  { left: '86%', top: '28%', rot: -6, w: 170 },
  { left: '-4%', top: '56%', rot: -4, w: 170, mobile: true },
  { left: '87%', top: '58%', rot: 5, w: 165, mobile: true },
  { left: '5%', top: '80%', rot: 6, w: 165 },
  { left: '26%', top: '86%', rot: -3, w: 150 },
  { left: '52%', top: '88%', rot: 4, w: 155 },
  { left: '74%', top: '82%', rot: -6, w: 165 },
  { left: '90%', top: '84%', rot: 8, w: 150, mobile: true },
  { left: '13%', top: '13%', rot: -9, w: 120 },
  { left: '72%', top: '14%', rot: 9, w: 120 },
]

const FLOAT_DELAYS = [0, 1.3, 0.6, 2.1, 0.9, 1.7]

export default function OpeningPage() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const tapCount = useRef(0)

  const photos = useMemo(() => {
    const intro = manifest.intro || []
    const firsts = people.map((p) => manifest[p.slug]?.[0]).filter(Boolean)
    const seconds = people.map((p) => manifest[p.slug]?.[1]).filter(Boolean)
    const group = manifest.group || []
    return [...intro, ...group, ...firsts, ...seconds].slice(0, SLOTS.length).map(asset)
  }, [])

  const onSeventeen = () => {
    tapCount.current += 1
    if (tapCount.current >= 5) {
      tapCount.current = 0
      heartBurst()
    }
  }

  return (
    <PageTransition>
      <div className="opening">
        {/* scattered photos */}
        {SLOTS.map((slot, i) => {
          const src = photos[i]
          if (!src && i >= 4) return null
          return (
            <motion.div
              key={i}
              className={`collage-item${slot.mobile ? '' : ' desktop-only'}`}
              style={{ left: slot.left, top: slot.top, zIndex: 1 }}
              initial={reduce ? false : { opacity: 0, y: 26, scale: 0.86, rotate: slot.rot * 2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                animate={
                  reduce
                    ? undefined
                    : { y: [0, -5, 0], rotate: [0, i % 2 ? 0.6 : -0.6, 0] }
                }
                transition={{
                  duration: 6 + (i % 4),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: FLOAT_DELAYS[i % FLOAT_DELAYS.length],
                }}
              >
                <Polaroid
                  src={src}
                  alt="a photo of Lora with the people who love her"
                  rotation={slot.rot}
                  width={slot.w}
                  aspect={1}
                  folder="public/photos/intro/"
                  eager={i < 6}
                />
              </motion.div>
            </motion.div>
          )
        })}

        {/* decorative scribbles + doodles */}
        <motion.button
          className="sticker-17 collage-item"
          style={{ left: '8%', top: '44%', zIndex: 6 }}
          onClick={onSeventeen}
          aria-label="seventeen!"
          initial={reduce ? false : { opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 16 }}
        >
          17!
        </motion.button>

        <span className="scribble collage-item desktop-only" style={{ left: '79%', top: '46%', fontSize: '1.5rem', transform: 'rotate(6deg)', zIndex: 6 }}>
          lora bora ♡
        </span>
        <span className="scribble hand2 collage-item desktop-only" style={{ left: '24%', top: '20%', fontSize: '1.05rem', transform: 'rotate(-5deg)', zIndex: 6 }}>
          est. 2009
        </span>
        <span className="scribble hand2 collage-item desktop-only" style={{ left: '66%', top: '75%', fontSize: '1.1rem', transform: 'rotate(4deg)', zIndex: 6 }}>
          seventeen ✩
        </span>
        <span className="scribble collage-item mobile-only" style={{ left: '68%', top: '30%', fontSize: '1.2rem', transform: 'rotate(6deg)', zIndex: 6 }}>
          lora bora ♡
        </span>

        <span className="collage-item desktop-only" style={{ left: '31%', top: '76%', zIndex: 6, opacity: 0.8 }} aria-hidden="true">
          <Doodle kind="cake" size={34} color="var(--rose-deep)" />
        </span>
        <span className="collage-item desktop-only" style={{ left: '90%', top: '18%', zIndex: 6, opacity: 0.7 }} aria-hidden="true">
          <Doodle kind="bow" size={30} color="var(--rose)" />
        </span>
        <span className="collage-item desktop-only" style={{ left: '4%', top: '18%', zIndex: 6, opacity: 0.7 }} aria-hidden="true">
          <Doodle kind="flower" size={28} color="#8aa16f" />
        </span>
        <span className="collage-item" style={{ left: '18%', top: '66%', zIndex: 6, opacity: 0.65 }} aria-hidden="true">
          <Doodle kind="star" size={22} color="#d9a441" />
        </span>
        <span className="collage-item desktop-only" style={{ left: '62%', top: '22%', zIndex: 6, opacity: 0.6 }} aria-hidden="true">
          <Doodle kind="smiley" size={24} color="var(--ink-soft)" />
        </span>
        <span className="collage-item" style={{ left: '80%', top: '70%', zIndex: 6, opacity: 0.7 }} aria-hidden="true">
          <Doodle kind="sparkle" size={20} color="var(--rose)" />
        </span>
        <span className="collage-item mobile-only" style={{ left: '10%', top: '24%', zIndex: 6, opacity: 0.7 }} aria-hidden="true">
          <Doodle kind="heart" size={22} color="var(--rose)" />
        </span>

        {/* a real scrapbook star from the PDF pages */}
        <img
          src={asset('/decorations/star-script.png')}
          alt=""
          aria-hidden="true"
          className="collage-item desktop-only"
          style={{ left: '46%', top: '73%', width: 54, opacity: 0.8, transform: 'rotate(-12deg)', zIndex: 6 }}
        />

        {/* pieces of tape scattered on the page itself */}
        <span className="tape desktop-only" style={{ left: '44%', top: '12%', transform: 'rotate(-14deg)' }} />
        <span className="tape" style={{ left: '12%', top: '90%', transform: 'rotate(10deg)' }} />

        {/* center title */}
        <motion.div
          className="opening-center"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="opening-title">
            Happy 17th Birthday,
            <br />
            <span className="rose">Lora Lee ♡</span>
          </h1>
          <p className="opening-subtitle">a little something from the people who love you</p>
          <motion.button
            className="gift-button"
            onClick={() => navigate('/letters')}
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            open your gift ♡<span className="spark" aria-hidden="true">✦</span>
          </motion.button>
        </motion.div>
      </div>
    </PageTransition>
  )
}
