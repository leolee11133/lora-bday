import { useEffect } from 'react'
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { personBySlug } from '../data/people.js'
import { markOpened } from '../hooks/useOpenedLetters.js'
import PageTransition from '../components/PageTransition.jsx'
import Doodle from '../components/Doodle.jsx'
import './pages.css'

export default function LetterPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const person = personBySlug(slug)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (person) markOpened(person.slug)
  }, [person])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!person) return <Navigate to="/letters" replace />

  const paragraphs = person.letter.split('\n\n')
  const isFamily = person.family

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
      <Link to={`/person/${person.slug}`} className="back-link">
        ← back to memories
      </Link>

      <div className="letter-page">
        <motion.article
          className="stationery"
          initial={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, rotateX: -28, y: 60, transformOrigin: 'top center' }
          }
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* tape at the top corners */}
          <span className="tape" style={{ top: -13, left: 26, transform: 'rotate(-5deg)' }} />
          <span className="tape" style={{ top: -13, right: 26, transform: 'rotate(4deg)' }} />

          {/* little decorations in the margins */}
          <span
            aria-hidden="true"
            style={{ position: 'absolute', top: 18, right: 20, opacity: 0.55 }}
          >
            <Doodle kind={person.envelope.doodle} size={26} color={person.accent} />
          </span>
          <span
            aria-hidden="true"
            style={{ position: 'absolute', bottom: 16, left: 18, opacity: 0.45 }}
          >
            <Doodle kind="flower" size={22} color={person.accent} />
          </span>

          <header style={{ marginBottom: 26, textAlign: 'center' }}>
            <p
              className="hand2"
              style={{ fontSize: '1rem', color: 'var(--ink-faint)', marginBottom: 2 }}
            >
              {isFamily ? 'from home, with all our love' : 'a letter, just for you'}
            </p>
            <h1
              className="script"
              style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', color: person.accent }}
            >
              from {person.name}
            </h1>
          </header>

          <div className="letter-body">
            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + Math.min(i, 6) * 0.09, duration: 0.5 }}
              >
                {para.split('\n').map((line, j, arr) => (
                  <span key={j}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </span>
                ))}
              </motion.p>
            ))}
            <motion.p
              className="letter-signature"
              style={{ color: person.accent }}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {person.signature}
            </motion.p>
          </div>
        </motion.article>

        <nav className="letter-nav" aria-label="letter navigation">
          <button className="letter-nav-btn" onClick={() => navigate(`/person/${person.slug}`)}>
            back to memories
          </button>
          <button className="letter-nav-btn primary" onClick={() => navigate('/letters')}>
            open another letter ♡
          </button>
        </nav>
      </div>
    </PageTransition>
  )
}
