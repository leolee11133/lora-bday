# happy 17th, lora ♡

A handcrafted digital scrapbook for Lora Lee's 17th birthday.

## Run it

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Adding / replacing photos

Drop `.jpg` / `.png` / `.webp` files into the person's folder:

```
public/photos/
  intro/       ← extra photos for the opening collage (optional)
  group/       ← group photos for the opening collage (optional)
  siri/
  ashley/
  jennifer/
  olivia/
  genevieve/
  parnavi/
  navya/
  elaina/
  radhika/
  lakshmi/
  leo/
  parents/
```

Photos are picked up automatically when the dev server starts. If the server is
already running, run `npm run photos` and refresh. Files are shown in
alphabetical order, so name them `siri-01.jpg`, `siri-02.jpg`, … to control
the order. The photos currently in these folders were extracted from the
scrapbook PDF; replace or add to them freely.

If a folder is empty the site shows pretty placeholder frames telling you
where to put the files, so nothing ever looks broken.

## Music

Put a song at `public/audio/birthday-song.mp3`. The "♫ our soundtrack" button
in the corner plays it (never autoplays).

## Where everything lives

- `src/data/people.js` — every person: envelope colors, stamps, doodles, page
  captions, and their letter (preserved exactly as written). Edit letters here.
- `src/data/photoManifest.json` — generated, don't edit by hand.
- `public/decorations/` — real scrapbook assets (tape, paperclips, torn paper)
  extracted from the PDF.

## Little details worth knowing

- Opened envelopes are remembered in the browser (localStorage), and a final
  message appears at the bottom of the letters page once all 12 are opened.
- Clicking the "17!" sticker on the opening page five times does something.
- Everything honors `prefers-reduced-motion`, works on iPhones, and is
  keyboard-accessible.
