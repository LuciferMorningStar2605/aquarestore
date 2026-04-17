import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const APPLICATIONS = [
  {
    id: 'defense',
    title: 'Defense & Security',
    desc: 'Enhance visibility for autonomous underwater vehicles (AUVs) and naval surveillance systems. Restoring clarity allows for real-time threat detection and safe navigation in highly turbid environments.'
  },
  {
    id: 'research',
    title: 'Marine Research',
    desc: 'Empower marine biologists to analyze coral reef health and aquatic species with publication-grade clarity, automatically removing heavy color casts without altering the underlying biological data.'
  },
  {
    id: 'discovery',
    title: 'Deep Sea Discovery',
    desc: 'Aid archaeological expeditions and shipwreck exploration. Restore historical artifacts lost to the deep sea by mathematically correcting extreme light absorption and scattering.'
  }
];

const SUBMARINE_IMG = '/@fs/Users/namishrathy/.gemini/antigravity/brain/4226492d-6066-4793-867e-c39ef5ae785d/light_submarine_1776437953984.png';

export default function Applications() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const submarineY = useTransform(scrollYProgress, [0, 1], [-50, 250]);

  return (
    <section id="applications" ref={containerRef} style={{ background: '#f8fafc', padding: '160px 24px', position: 'relative', overflow: 'hidden' }}>
      
      <div className="flex-col-mobile" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 80, alignItems: 'flex-start' }}>
        
        {/* Sticky Visuals (Submarine) */}
        <div className="hide-on-mobile" style={{ flex: 1, position: 'sticky', top: '15vh', height: '70vh' }}>
          <motion.div style={{ y: submarineY, width: '100%', maxWidth: 500, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 25px 50px rgba(15, 23, 42, 0.1)' }}>
             <img src={SUBMARINE_IMG} alt="Submarine AUV" style={{ width: '100%', display: 'block' }} />
          </motion.div>
        </div>

        {/* Scrolling Content */}
        <div style={{ flex: 1, paddingTop: '10vh' }}>
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             style={{ marginBottom: 100 }}
           >
              <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--text-pri)' }}>
                Applied across <br/>the industry.
              </h2>
           </motion.div>
           
           {APPLICATIONS.map((app, i) => (
              <motion.div 
                key={app.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-100px", once: true }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: 100 }}
              >
                 <div style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 700, marginBottom: 16, borderBottom: '2px solid var(--accent)', paddingBottom: 8, display: 'inline-block' }}>
                   0{i+1}
                 </div>
                 <h3 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, color: 'var(--text-pri)' }}>{app.title}</h3>
                 <p style={{ fontSize: 18, color: 'var(--text-sec)', lineHeight: 1.7 }}>{app.desc}</p>
              </motion.div>
           ))}
        </div>
      </div>
    </section>
  )
}
