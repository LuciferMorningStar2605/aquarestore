import { motion } from 'framer-motion'

export default function SystemInfo() {
  return (
    <section id="system" style={{ padding: '120px 24px', background: '#fff' }}>
      <div className="flex-col-mobile" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ flex: 1 }}>
          <h2 style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 24, color: 'var(--text-pri)' }}>The System.</h2>
          <p style={{ fontSize: 18, color: 'var(--text-sec)', lineHeight: 1.8, marginBottom: 24 }}>
            AquaRestore utilizes a highly optimized <strong>U-Net Generator</strong> combined with a <strong>PatchGAN Discriminator</strong>. By learning the physical properties of water column scattering, the neural network reverses color distortion and severe backscatter.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              "Trained on the UIEB Dataset (890 high-res image pairs)",
              "Optimized L1 and Adversarial Loss for structural fidelity",
              "Real-time inference powered by PyTorch and FastAPI"
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: 'var(--text-pri)', fontWeight: 500 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ flex: 1, background: 'var(--bg-card)', padding: 48, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 200 }}>
              <div style={{ width: '18%', height: 160, background: 'var(--border)', borderRadius: 8 }} />
              <div style={{ width: '18%', height: 100, background: 'var(--border)', borderRadius: 8 }} />
              <div style={{ width: '18%', height: 60, background: 'var(--accent)', borderRadius: 8, boxShadow: '0 0 20px rgba(2,132,199,0.3)' }} />
              <div style={{ width: '18%', height: 100, background: 'var(--border)', borderRadius: 8 }} />
              <div style={{ width: '18%', height: 160, background: 'var(--border)', borderRadius: 8 }} />
           </div>
           <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>U-NET ENCODER-DECODER ARCHITECTURE</p>
        </motion.div>
      </div>
    </section>
  )
}
