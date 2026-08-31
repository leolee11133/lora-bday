import { useNavigate, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { people } from '../data/people.js'
import { useOpenedLetters } from '../hooks/useOpenedLetters.js'
import PageTransition from '../components/PageTransition.jsx'
import Envelope from '../components/Envelope.jsx'
import Doodle from '../components/Doodle.jsx'
import './pages.css'

export default function EnvelopesPage() {
  const navigate = useNavigate()
  const { isOpened, allOpened } = useOpenedLetters()
  const reduce = useReducedMotion()

  return (
    <PageTransition>
      <Link to="/" className="back-link">
        ← back to the beginning
      </Link>

      <div className="envelopes-page">
        <h1 className="envelopes-heading">letters from your people ♡</h1>
        <p className="envelopes-sub">17 years of being loved. these are just a few reminders.</p>
        <p className="envelopes-progress">pick an envelope, any envelope</p>

        <div className="envelope-desk">
          {people.map((person, i) => (
            <div className="envelope-slot" key={person.slug}>
              <Envelope
                person={person}
                index={i}
                opened={isOpened(person.slug)}
                onOpen={() => navigate(`/person/${person.slug}`)}
              />
            </div>
          ))}
        </div>

        {allOpened && (
          <motion.p
            className="final-message"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: 'easeOut' }}
          >
            you are so, so loved.
            <br />
            happy seventeen, lora ♡
            <motion.span
              aria-hidden="true"
              style={{ display: 'inline-block', marginLeft: 10, verticalAlign: 'middle' }}
              animate={reduce ? undefined : { scale: [1, 1.18, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Doodle kind="heart" size={26} color="var(--rose-deep)" filled />
            </motion.span>
          </motion.p>
        )}
      </div>
    </PageTransition>
  )
}
