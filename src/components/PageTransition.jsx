import { motion, useReducedMotion } from 'framer-motion'

// Shared page wrapper: pages fade/settle in like a scrapbook page turning.
export default function PageTransition({ children, style }) {
  const reduce = useReducedMotion()
  return (
    <motion.main
      className="page"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.997 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.main>
  )
}
