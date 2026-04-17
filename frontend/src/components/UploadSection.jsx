import { useState, useRef, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function UploadSection({ onResult }) {
  const [dragging, setDragging]   = useState(false)
  const [file, setFile]           = useState(null)
  const [preview, setPreview]     = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const inputRef = useRef()

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }, [])

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true); setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API_URL}/restore`, { method: 'POST', body: form })
      if (!res.ok) {
        let errStr = `Server error ${res.status}`
        try {
          const errData = await res.json()
          errStr = errData.detail || errStr
        } catch(e) {}
        throw new Error(errStr)
      }
      const data = await res.json()
      onResult({ original: preview, restored: data.restored })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="upload" style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.15em',
          color: 'var(--accent)', textTransform: 'uppercase',
        }}>Restoration Engine</span>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
          letterSpacing: '-0.03em', marginTop: 12, color: 'var(--text-pri)'
        }}>Upload your image</h2>
        <p style={{ color: 'var(--text-sec)', marginTop: 12 }}>
          JPG or PNG. Supports any underwater photograph.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border-hl)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: preview ? 0 : '64px 32px',
          textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(0,212,255,0.03)' : 'var(--bg-card)',
          transition: 'all 0.2s',
          overflow: 'hidden',
          minHeight: preview ? 320 : 'auto',
          position: 'relative',
        }}
      >
        {preview ? (
          <img src={preview} alt="preview"
            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }} />
        ) : (
          <>
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>⬆</div>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Drop image here or click to browse</p>
            <p style={{ fontSize: 13, color: 'var(--text-sec)' }}>PNG, JPG up to 10MB</p>
          </>
        )}
        {dragging && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,212,255,0.05)',
            border: '2px solid var(--accent)',
            borderRadius: 'inherit',
          }} />
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])} />

      {file && (
        <div style={{
          marginTop: 16, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderRadius: 'var(--radius)',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          fontSize: 13,
        }}>
          <span style={{ color: 'var(--text-sec)' }}>
            {file.name} · {(file.size / 1024).toFixed(0)} KB
          </span>
          <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null) }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>
            ×
          </button>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: 16, padding: '12px 16px',
          background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)',
          borderRadius: 'var(--radius)', fontSize: 14, color: 'var(--error)',
        }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        style={{
          width: '100%', marginTop: 24,
          padding: '16px 32px', borderRadius: 'var(--radius)',
          background: file && !loading ? 'var(--accent)' : 'var(--bg-hover)',
          color: file && !loading ? '#000' : 'var(--text-muted)',
          border: 'none', fontWeight: 700, fontSize: 16, cursor: file && !loading ? 'pointer' : 'not-allowed',
          letterSpacing: '-0.01em', transition: 'all 0.2s',
        }}
      >
        {loading ? 'Restoring...' : 'Restore Image →'}
      </button>
    </section>
  )
}
