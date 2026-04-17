const STEPS = [
  {
    num: '01',
    title: 'Upload',
    body: 'Drop any degraded underwater image. The system accepts JPG and PNG at any resolution.',
  },
  {
    num: '02',
    title: 'GAN Processing',
    body: 'A U-Net Generator reconstructs the image — correcting color shifts, restoring contrast, and removing haze artifacts introduced by water absorption.',
  },
  {
    num: '03',
    title: 'Download',
    body: 'Receive a high-fidelity restored image in seconds. Side-by-side comparison lets you inspect every improvement.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{
      padding: '80px 24px', maxWidth: 1100, margin: '0 auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.15em',
          color: 'var(--accent)', textTransform: 'uppercase',
        }}>Process</span>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
          letterSpacing: '-0.03em', marginTop: 12,
        }}>
          How it works
        </h2>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
      }}>
        {STEPS.map(({ num, title, body }) => (
          <div key={num} style={{
            padding: 32, borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hl)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{
              fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
              color: 'var(--accent)', marginBottom: 16,
            }}>{num}</div>
            <h3 style={{
              fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12,
            }}>{title}</h3>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7 }}>{body}</p>
          </div>
        ))}
      </div>

      {/* Tech detail row */}
      <div style={{
        marginTop: 48, padding: '24px 32px',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        display: 'flex', flexWrap: 'wrap', gap: 32,
      }}>
        {[
          ['Model', 'U-Net GAN (Pix2Pix variant)'],
          ['Dataset', 'UIEB — 890 paired images'],
          ['Loss', 'Adversarial + L1 (λ=100)'],
          ['Input', '256 × 256 RGB'],
          ['Deployment', 'FastAPI + Render (CPU)'],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
