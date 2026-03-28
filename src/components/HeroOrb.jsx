import { useState, useCallback } from 'react';
import { BrainCircuit } from 'lucide-react';

/* ============================================================
   HERO VISUAL (Obsidian Holographic HUD)
   A premium, glass-like 3D component enforcing strict Obsidian
   Intelligence parameters (1px teal borders, dark BG, subtle glow).
   ============================================================ */
export default function HeroVisual() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 35; 
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -35;
    setTilt({ x, y });
  }, []);

  return (
    <div
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); setTilt({ x: 0, y: 0 }); }}
      style={{ 
        position: 'relative', width: '100%', height: 600, 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        perspective: 1600 
      }}
    >
      <style>{`
        @keyframes spinFlat {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes scanlineFlash {
          0% { opacity: 0; transform: translateY(-10px); }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; transform: translateY(460px); }
        }
        .core-t {
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
      
      {/* ═ THE MOTHERBOARD ═ */}
      <div className="core-t" style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 560, height: 460, 
        backgroundColor: 'rgba(8, 9, 12, 0.4)', // Slightly transparent var(--bg-primary)
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--teal-12)',
        borderRadius: 'var(--radius-lg)',
        transformStyle: 'preserve-3d',
        transform: `translate(-50%, -50%) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) rotateZ(${hovering ? 0 : -2}deg)`,
        boxShadow: hovering 
          ? '0 20px 60px rgba(15, 207, 188, 0.08)' 
          : '0 10px 40px rgba(0, 0, 0, 0.5)',
        padding: 'var(--space-3)', 
        display: 'grid', 
        gridTemplateColumns: 'minmax(200px, 1fr) 1.2fr', 
        gridTemplateRows: '1fr 1fr', 
        gap: 'var(--space-3)'
      }}>
        
        {/* Ambient Grid Background inside Motherboard */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', zIndex: 1, pointerEvents: 'none' }}>
           {/* Grid Pattern */}
           <div style={{ position: 'absolute', inset: 0, backgroundSize: '30px 30px', backgroundImage: 'linear-gradient(to right, rgba(15, 207, 188, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 207, 188, 0.05) 1px, transparent 1px)', opacity: hovering ? 1 : 0.3, transition: 'opacity 1s ease' }} />
           
           {/* Animated Glowing Orbs (Data Nodes) */}
           <div style={{ position: 'absolute', top: hovering ? '20%' : '80%', left: '20%', width: 120, height: 120, background: 'var(--teal)', borderRadius: '50%', filter: 'blur(60px)', opacity: hovering ? 0.4 : 0.1, transition: 'all 3s cubic-bezier(0.16, 1, 0.3, 1)' }} />
           <div style={{ position: 'absolute', top: hovering ? '60%' : '10%', right: '10%', width: 150, height: 150, background: 'var(--danger)', borderRadius: '50%', filter: 'blur(70px)', opacity: hovering ? 0.2 : 0.05, transition: 'all 4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s' }} />
           
           {/* Horizontal Scanner Beam */}
           {hovering && (
             <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(15, 207, 188, 0.05) 45%, rgba(15, 207, 188, 0.2) 50%, rgba(15, 207, 188, 0.05) 55%, transparent)', animation: 'scanlineFlash 4s linear infinite' }} />
           )}
        </div>

        {/* ——— STEP 1: YOUR IDEA (Top Left) ——— */}
        <div className="obs-card core-t" style={{
           position: 'relative', zIndex: 2,
           gridColumn: '1 / 2', gridRow: '1 / 2',
           backgroundColor: 'var(--bg-elevated)', /* Slate Dark */
           padding: 'var(--space-3)',
           transform: `translateZ(${hovering ? 60 : 20}px) translateX(${hovering ? -10 : 0}px) translateY(${hovering ? -10 : 0}px)`,
           boxShadow: hovering ? '0 12px 30px rgba(0,0,0,0.6)' : 'none',
           display: 'flex', flexDirection: 'column'
        }}>
           <div className="heading-card" style={{ borderBottom: '1px solid var(--teal-12)', paddingBottom: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>Step 1: Your Idea</div>
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             <p className="text-small" style={{ marginBottom: 'var(--space-1)' }}>Describe your startup:</p>
             <div style={{ padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--teal-25)', color: 'var(--teal-dim)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 }}>
               "AI for Real Estate"
             </div>
           </div>
        </div>

        {/* ——— STEP 2: ARIA BRAIN (Bottom Left) ——— */}
        <div className="obs-card core-t" style={{
           position: 'relative', zIndex: 2,
           gridColumn: '1 / 2', gridRow: '2 / 3',
           backgroundColor: 'var(--bg-secondary)', 
           border: hovering ? '1px solid rgba(255, 77, 77, 0.4)' : '1px solid var(--teal-12)', /* Danger hint */
           padding: 'var(--space-3)',
           transform: `translateZ(${hovering ? 100 : 30}px) translateX(${hovering ? -15 : 0}px) translateY(${hovering ? 10 : 0}px)`,
           boxShadow: hovering ? '0 16px 40px rgba(255, 77, 77, 0.08)' : '0 10px 20px rgba(0,0,0,0.4)',
           display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
           <div className="text-label" style={{ borderBottom: '1px solid var(--teal-12)', paddingBottom: 'var(--space-1)', marginBottom: 'var(--space-3)', width: '100%', textAlign: 'center', fontSize: 11, color: hovering ? 'var(--danger)' : 'var(--teal)' }}>Step 2: ARIA Brain</div>
           
           <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 'var(--space-3)' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 80, height: 80, border: hovering ? '1px dashed var(--danger)' : '1px dashed var(--teal-40)', borderRadius: '50%', animation: `spinFlat ${hovering ? '4s' : '15s'} linear infinite`, transition: 'all 0.8s' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 64, height: 64, border: hovering ? '1px solid rgba(255, 77, 77, 0.4)' : '1px solid var(--teal-25)', borderRadius: '50%', animation: `spinFlat ${hovering ? '3s' : '10s'} reverse linear infinite`, transition: 'all 0.8s' }} />
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: hovering ? 'var(--danger)' : 'var(--teal)', transition: 'color 0.8s' }}>
                 <BrainCircuit size={24} strokeWidth={1.5} />
              </div>
           </div>
           
           <div className="text-small" style={{ color: hovering ? 'var(--danger)' : 'var(--text-muted)' }}>
             {hovering ? '> Analyzing market...' : 'Waiting for idea'}
           </div>
        </div>

        {/* ——— STEP 3: FINAL REPORT (Right Column) ——— */}
        <div className="obs-card core-t" style={{
           position: 'relative', zIndex: 2, overflow: 'hidden',
           gridColumn: '2 / 3', gridRow: '1 / span 2',
           backgroundColor: 'var(--bg-elevated)',
           padding: 'var(--space-3)',
           transform: `translateZ(${hovering ? 80 : 10}px) translateX(${hovering ? 15 : 0}px)`,
           boxShadow: hovering ? '0 12px 40px rgba(0,0,0,0.5)' : 'none',
           display: 'flex', flexDirection: 'column'
        }}>
           {/* Subtle corner glow */}
           <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'var(--teal-06)', borderRadius: '50%', filter: 'blur(40px)', opacity: hovering ? 1 : 0, transition: 'opacity 0.8s', pointerEvents: 'none' }} />

           <div className="heading-card" style={{ borderBottom: '1px solid var(--teal-12)', paddingBottom: 'var(--space-1)', marginBottom: 8 }}>Step 3: Your Report</div>
           
           {/* Score + Summary Row */}
           <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
             {/* Viability Score Ring */}
             <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
               <svg viewBox="0 0 52 52" style={{ width: 52, height: 52, transform: 'rotate(-90deg)' }}>
                 <circle cx="26" cy="26" r="22" fill="none" stroke="var(--teal-12)" strokeWidth="3" />
                 <circle cx="26" cy="26" r="22" fill="none" stroke="var(--teal)" strokeWidth="3"
                   strokeDasharray={`${hovering ? 110 : 20} 138`}
                   strokeLinecap="round"
                   style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }} />
               </svg>
               <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: hovering ? 'var(--teal)' : 'var(--text-muted)', transition: 'color 0.6s' }}>
                 {hovering ? '82' : '--'}
               </div>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
               <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--teal-40)', marginBottom: 2 }}>Viability Score</div>
               <div style={{ fontSize: 11, color: hovering ? 'var(--teal)' : 'var(--text-muted)', fontWeight: 600, transition: 'color 0.6s' }}>{hovering ? 'High Potential' : 'Pending...'}</div>
             </div>
           </div>

           {/* Inner Report Panel */}
           <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--teal-12)', padding: '10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              
              {/* Stat Rows */}
              {[
                { label: 'Market Size', value: '$4.2B', pct: 85 },
                { label: 'Competition', value: 'Medium', pct: 55 },
                { label: 'Growth Rate', value: '24%', pct: 72 },
              ].map((stat, i) => (
                <div key={stat.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)' }}>{stat.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: hovering ? 'var(--teal)' : 'var(--teal-40)', fontWeight: 600, transition: 'color 0.6s' }}>{hovering ? stat.value : '---'}</span>
                  </div>
                  <div style={{ height: 3, backgroundColor: 'var(--teal-12)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: hovering ? `${stat.pct}%` : '0%', backgroundColor: i === 1 ? 'var(--danger)' : 'var(--teal)', borderRadius: 2, transition: `width 1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s` }} />
                  </div>
                </div>
              ))}

              {/* Tags */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
                {['PropTech', 'B2B SaaS', 'AI/ML'].map((tag, i) => (
                  <span key={tag} style={{
                    padding: '2px 8px', borderRadius: 100, fontSize: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 1,
                    background: hovering ? (i === 0 ? 'var(--teal-12)' : i === 1 ? 'rgba(255,77,77,0.1)' : 'rgba(255,190,0,0.1)') : 'rgba(255,255,255,0.03)',
                    color: hovering ? (i === 0 ? 'var(--teal)' : i === 1 ? 'var(--danger)' : '#FFB800') : 'var(--text-muted)',
                    border: `1px solid ${hovering ? (i === 0 ? 'var(--teal-25)' : i === 1 ? 'rgba(255,77,77,0.2)' : 'rgba(255,190,0,0.2)') : 'var(--teal-12)'}`,
                    transition: `all 0.6s ease ${0.3 + i * 0.1}s`,
                    opacity: hovering ? 1 : 0.4
                  }}>{tag}</span>
                ))}
              </div>

              {/* Mini Bar Chart */}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', height: 48, gap: 3 }}>
                {[65, 40, 85, 55, 70, 90, 45, 75, 60].map((h, i) => (
                  <div key={i} style={{
                    flex: 1,
                    backgroundColor: i % 3 === 2 ? 'var(--danger)' : 'var(--teal)',
                    opacity: hovering ? (0.5 + (h / 200)) : 0.1,
                    height: hovering ? `${h}%` : '12%',
                    borderRadius: '2px 2px 0 0',
                    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`
                  }} />
                ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
