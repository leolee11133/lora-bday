// Scans public/photos/* and writes src/data/photoManifest.json.
// Runs automatically before `npm run dev` and `npm run build`.
// To add photos: drop .jpg/.jpeg/.png/.webp files into the person's folder
// (e.g. public/photos/siri/) and restart the dev server (or run `npm run photos`).

import { readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const photosDir = join(root, 'public', 'photos')
const outFile = join(root, 'src', 'data', 'photoManifest.json')

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i
const manifest = {}

if (existsSync(photosDir)) {
  for (const folder of readdirSync(photosDir).sort()) {
    const dir = join(photosDir, folder)
    if (!statSync(dir).isDirectory()) continue
    manifest[folder] = readdirSync(dir)
      .filter((f) => IMAGE_RE.test(f))
      .sort()
      .map((f) => `/photos/${folder}/${f}`)
  }
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(manifest, null, 2) + '\n')
console.log(
  `photo manifest: ${Object.entries(manifest)
    .map(([k, v]) => `${k}(${v.length})`)
    .join(' ')}`
)
