import { forwardRef } from 'react'

// A polaroid-style photo. If src is missing, renders a pretty placeholder
// telling you which folder to drop the real photo into.
const Polaroid = forwardRef(function Polaroid(
  { src, alt, caption, rotation = 0, width = 180, aspect = 0.95, folder, eager = false, style },
  ref
) {
  return (
    <figure
      ref={ref}
      className="polaroid"
      style={{ width, transform: `rotate(${rotation}deg)`, ...style }}
    >
      <div className="photo-frame" style={{ height: width * aspect }}>
        {src ? (
          <img
            src={src}
            alt={alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable="false"
          />
        ) : (
          <div className="photo-placeholder">
            <span style={{ fontSize: '1.4rem' }}>✿</span>
            <span>
              add a photo to
              <br />
              {folder || 'public/photos/…'}
            </span>
          </div>
        )}
      </div>
      {caption && <figcaption className="caption">{caption}</figcaption>}
    </figure>
  )
})

export default Polaroid
