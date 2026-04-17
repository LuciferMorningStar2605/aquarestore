import { useState } from 'react'

export default function ResultViewer({ result }) {
  const [slider, setSlider] = useState(50)

  if (!result) return null

  return (
    <section style={{
      padding: '0 24px 80px', maxWidth: 1000, margin: '0 auto',
    }}>
      <div style={{
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Restoration Result</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: 'rgba(0,196,140,0.12)', color: 'var(--success)',
              border: '1px solid rgba(0,196,140,0.2)',
            }}>✓ Complete</span>
            <a
              href={result.restored}
              download="aquarestore-output.jpg"
              style={{
                padding: '6px 16px', borderRadius: 'var(--radius)',
                background: 'var(--accent)', color: '#000',
                fontWeight: 600, fontSize: 13, textDecoration: 'none',
              }}
            >
              Download
            </a>
          </div>
        </div>

        {/* Slider Comparison */}
        <div style={{ position: 'relative', cursor: 'ew-resize', userSelect: 'none' }}>
          {/* Restored (background) */}
          <img src={result.restored} alt="restored"
            style={{ width: '100%', display: 'block', maxHeight: 500, objectFit: 'cover' }} />

          {/* Original (overlaid left portion) */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: `${slider}%`, height: '100%', overflow: 'hidden',
          }}>
            <img src={result.original} alt="original"
              style={{ width: `${10000 / slider}%`, maxWidth: 'none', maxHeight: 500, objectFit: 'cover', display: 'block' }} />
          </div>

          {/* Divider line */}
          <div style={{
            position: 'absolute', top: 0, left: `${slider}%`,
            width: 2, height: '100%',
            background: '#fff', transform: 'translateX(-50%)',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 36, height: 36, borderRadius: '50%',
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
              fontSize: 14, color: '#333', fontWeight: 700,
            }}>⇔</div>
          </div>

          {/* Labels */}
          <div style={{
            position: 'absolute', top: 16, left: 16,
            padding: '4px 10px', borderRadius: 4,
            background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12, fontWeight: 600,
          }}>Original</div>
          <div style={{
            position: 'absolute', top: 16, right: 16,
            padding: '4px 10px', borderRadius: 4,
            background: 'rgba(0,212,255,0.8)', color: '#000', fontSize: 12, fontWeight: 600,
          }}>Restored</div>

          {/* Range slider */}
          <input type="range" min={5} max={95} value={slider}
            onChange={e => setSlider(Number(e.target.value))}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              opacity: 0, cursor: 'ew-resize',
            }} />
        </div>

        <div style={{
          padding: '12px 24px', borderTop: '1px solid var(--border)',
          fontSize: 13, color: 'var(--text-muted)', textAlign: 'center',
        }}>
          Drag the slider to compare original vs restored
        </div>
      </div>
    </section>
  )
}
