export default function Navbar() {
  const links = [
    { name: 'System', id: 'system' },
    { name: 'Applications', id: 'applications' },
    { name: 'Demo', id: 'upload' }
  ]

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="glass" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px' }}>
      <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', cursor: 'pointer', color: 'var(--text-pri)' }} onClick={() => window.scrollTo(0,0)}>
        AquaRestore<span style={{ color: 'var(--accent)' }}>.</span>
      </div>
      
      <div className="hide-on-mobile" style={{ display: 'flex', gap: 40, fontSize: 14, fontWeight: 500, color: 'var(--text-sec)' }}>
        {links.map(l => (
          <span key={l.name} onClick={() => scrollTo(l.id)} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-pri)'} onMouseOut={e => e.target.style.color = 'var(--text-sec)'}>
            {l.name}
          </span>
        ))}
      </div>

      <button onClick={() => scrollTo('upload')} style={{ background: 'var(--text-pri)', color: '#fff', padding: '10px 24px', borderRadius: 40, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'}>
        Try Now →
      </button>
    </nav>
  )
}
