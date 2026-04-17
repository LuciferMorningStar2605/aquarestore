import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section style={{ 
      minHeight: '90vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      textAlign: 'center', 
      padding: '120px 24px 0',
      background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)'
    }}>
      <div style={{ maxWidth: 900 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ display: 'inline-block', padding: '8px 16px', background: 'var(--accent-dim)', borderRadius: 30, fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 32, letterSpacing: '0.05em' }}
        >
          AQUARESTORE V1.0 IS LIVE
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 32, color: 'var(--text-pri)' }}
        >
          Clarity beneath <br/>
          <span style={{ color: 'var(--accent)' }}>the surface.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontSize: 'clamp(18px, 2vw, 24px)', color: 'var(--text-sec)', maxWidth: 700, margin: '0 auto 56px', lineHeight: 1.6, fontWeight: 400 }}
        >
          Pioneering AI infrastructure for oceanographic exploration. Instantly restore degraded underwater imagery with our state-of-the-art Generative Adversarial Networks.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={() => document.getElementById('upload').scrollIntoView({ behavior: 'smooth' })}
          style={{
            background: 'var(--text-pri)', color: '#fff', border: 'none', padding: '20px 40px', borderRadius: '40px', fontSize: 18, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(15, 23, 42, 0.25)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.15)'; }}
        >
          Restore an Image
        </motion.button>
      </div>
    </section>
  )
}
