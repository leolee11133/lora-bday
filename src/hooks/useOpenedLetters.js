import { useCallback, useSyncExternalStore } from 'react'
import { people } from '../data/people.js'

const KEY = 'lora-opened-letters'
const listeners = new Set()

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

let cache = null
function getSnapshot() {
  if (cache === null) cache = read()
  return cache
}

function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function markOpened(slug) {
  const current = getSnapshot()
  if (current.includes(slug)) return
  cache = [...current, slug]
  try {
    localStorage.setItem(KEY, JSON.stringify(cache))
  } catch {
    /* private browsing etc. */
  }
  listeners.forEach((cb) => cb())
}

export function useOpenedLetters() {
  const opened = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const isOpened = useCallback((slug) => opened.includes(slug), [opened])
  const allOpened = people.every((p) => opened.includes(p.slug))
  return { opened, isOpened, allOpened, total: people.length, count: opened.filter((s) => people.some((p) => p.slug === s)).length }
}
