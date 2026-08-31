// One-shot heart shower for the "17" easter egg. Pure DOM, cleans itself up.
export default function heartBurst() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const container = document.createElement('div')
  container.setAttribute('aria-hidden', 'true')
  Object.assign(container.style, {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 96,
    overflow: 'hidden',
  })
  document.body.appendChild(container)

  const glyphs = ['♡', '♥', '✦', '❀']
  const colors = ['#c98a9a', '#e8b7c3', '#b8a3d6', '#d9a441', '#8aa16f']
  const count = reduced ? 8 : 36

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)]
    const x = Math.random() * 100
    const dur = 2 + Math.random() * 1.8
    const delay = Math.random() * 0.7
    Object.assign(el.style, {
      position: 'absolute',
      left: `${x}vw`,
      top: '-5vh',
      fontSize: `${14 + Math.random() * 18}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: '0',
      transform: 'translateY(0) rotate(0deg)',
      transition: `transform ${dur}s ease-in ${delay}s, opacity 0.4s ease ${delay}s`,
      willChange: 'transform',
      fontFamily: 'serif',
    })
    container.appendChild(el)
    requestAnimationFrame(() => {
      el.style.opacity = '0.95'
      el.style.transform = `translateY(112vh) rotate(${Math.random() * 160 - 80}deg)`
    })
  }
  setTimeout(() => container.remove(), 5200)
}
