import { useState } from 'react'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import SystemInfo    from './components/SystemInfo'
import Applications  from './components/Applications'
import UploadSection from './components/UploadSection'
import ResultViewer  from './components/ResultViewer'
import HowItWorks    from './components/HowItWorks'

export default function App() {
  const [result, setResult] = useState(null)

  return (
    <>
      <Navbar />
      <Hero />
      <SystemInfo />
      <Applications />
      <UploadSection onResult={setResult} />
      {result && <ResultViewer result={result} />}
      <HowItWorks />

      <footer style={{
        borderTop: '1px solid #111', padding: '32px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'var(--text-muted)',
      }}>
        <span>AquaRestore — GAN-based underwater image restoration</span>
        <span>Trained on UIEB Dataset · Built with PyTorch + FastAPI + React</span>
      </footer>
    </>
  )
}
