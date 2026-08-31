// Small seeded PRNG so scrapbook scatter looks organic but stays stable
// between renders and visits (no layout shuffling on refresh).

export function seededRandom(seedString) {
  let h = 2166136261
  for (let i = 0; i < seedString.length; i++) {
    h ^= seedString.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return function next() {
    h += h << 13
    h ^= h >>> 7
    h += h << 3
    h ^= h >>> 17
    h += h << 5
    return ((h >>> 0) % 100000) / 100000
  }
}

export const range = (rand, min, max) => min + rand() * (max - min)
