import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import OpeningPage from './pages/OpeningPage.jsx'
import EnvelopesPage from './pages/EnvelopesPage.jsx'
import MemoryPage from './pages/MemoryPage.jsx'
import LetterPage from './pages/LetterPage.jsx'
import SparkleCursor from './components/SparkleCursor.jsx'
import MusicButton from './components/MusicButton.jsx'

export default function App() {
  const location = useLocation()

  return (
    <>
      <SparkleCursor />
      <MusicButton />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<OpeningPage />} />
          <Route path="/letters" element={<EnvelopesPage />} />
          <Route path="/person/:slug" element={<MemoryPage />} />
          <Route path="/person/:slug/letter" element={<LetterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
