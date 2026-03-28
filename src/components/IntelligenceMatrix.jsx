import { useState, useEffect, useRef } from 'react';
import { Activity, Crosshair, Users, BookOpen, ChevronRight } from 'lucide-react';

export default function IntelligenceMatrix() {
   const [hoveredNode, setHoveredNode] = useState(null);
   const canvasRef = useRef(null);
   const frameRef = useRef(null);
   const timeRef = useRef(0);

   // --- 3D Canvas AI Globe (Integrated & Reactive) ---
   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width = 600;
      const height = canvas.height = 600;

      const particles = [];
      const numParticles = 600;
      const radius = 200;
      const phi = Math.PI * (3 - Math.sqrt(5));

      for (let i = 0; i < numParticles; i++) {
         const y = 1 - (i / (numParticles - 1)) * 2;
         const radiusAtY = Math.sqrt(1 - y * y);
         const theta = phi * i;
         particles.push({
            x0: Math.cos(theta) * radiusAtY,
            y0: y,
            z0: Math.sin(theta) * radiusAtY,
            isSpecial: Math.random() > 0.96,
            color: Math.random() > 0.7 ? '#FF4D4D' : '#0FCFBC',
            offset: Math.random() * 100
         });
      }

      let rotationX = 0.4;
      let rotationY = 0;

      const render = () => {
         timeRef.current += 0.006;
         rotationY += 0.003;

         ctx.clearRect(0, 0, width, height);
         const cx = width / 2;
         const cy = height / 2;

         const projected = [];
         for (let i = 0; i < numParticles; i++) {
            const p = particles[i];
            const y1 = p.y0 * Math.cos(rotationX) - p.z0 * Math.sin(rotationX);
            const z1 = p.y0 * Math.sin(rotationX) + p.z0 * Math.cos(rotationX);
            const x2 = p.x0 * Math.cos(rotationY) + z1 * Math.sin(rotationY);
            const z2 = z1 * Math.cos(rotationY) - p.x0 * Math.sin(rotationY);

            let pSize = (z2 + 2) / 3;
            let pRadius = radius;

            if (hoveredNode === 'market' && p.color === '#0FCFBC') {
               pRadius += Math.sin(timeRef.current * 15 + p.offset) * 10;
            }
            if (hoveredNode === 'competitor' && p.color === '#FF4D4D') {
               pRadius += Math.sin(timeRef.current * 20 + p.offset) * 20;
               pSize *= 2;
            }
            if (hoveredNode === 'playbook') {
               pRadius = radius * (1 + Math.sin(timeRef.current * 2) * 0.1);
               pSize *= 1.5;
            }

            projected.push({
               x: cx + x2 * pRadius,
               y: cy + y1 * pRadius,
               z: z2,
               scale: pSize,
               isSpecial: p.isSpecial,
               color: hoveredNode === 'playbook' ? '#FFD700' : p.color // Strategy Gold
            });
         }

         projected.sort((a, b) => a.z - b.z);

         for (let i = 0; i < projected.length; i++) {
            const pt = projected[i];
            const opacity = Math.max(0.1, (pt.z + 1) / 2);
            ctx.globalAlpha = opacity;

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.scale * (pt.isSpecial ? 3.5 : 1.5), 0, Math.PI * 2);
            ctx.fillStyle = pt.color;
            if (pt.isSpecial || hoveredNode === 'playbook') {
               ctx.shadowBlur = 15;
               ctx.shadowColor = pt.color;
            } else {
               ctx.shadowBlur = 0;
            }
            ctx.fill();
         }

         // HUD Ring
         ctx.save();
         ctx.translate(cx, cy);
         ctx.rotate(rotationX * 0.5);
         ctx.scale(1, 0.25);
         ctx.beginPath();
         ctx.arc(0, 0, radius + 40, 0, Math.PI * 2);
         ctx.strokeStyle = hoveredNode === 'audience' ? 'var(--teal)' : 'rgba(15, 207, 188, 0.1)';
         ctx.lineWidth = hoveredNode === 'audience' ? 4 : 2;
         ctx.stroke();
         ctx.restore();

         frameRef.current = requestAnimationFrame(render);
      };

      render();
      return () => cancelAnimationFrame(frameRef.current);
   }, [hoveredNode]);

   return (
      <div style={{ width: '100%', maxWidth: 1400, margin: '10px auto', position: 'relative' }}>

         <style>{`
          .matrix-container {
             display: grid;
             grid-template-columns: 1fr 1.5fr 1fr;
             gap: 24px;
             align-items: center;
          }
          .diagnostic-card {
             background: rgba(14, 17, 23, 0.4);
             border: 1px solid var(--teal-12);
             border-radius: 12px;
             padding: 24px;
             transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
             cursor: crosshair;
             position: relative;
             overflow: hidden;
          }
          .diagnostic-card:hover {
             border-color: var(--teal);
             background: rgba(15, 207, 188, 0.03);
             transform: scale(1.02);
          }
          .card-tag {
             font-family: var(--font-mono);
             font-size: 10px;
             color: var(--teal);
             letter-spacing: 2px;
             margin-bottom: 12px;
             display: flex;
             align-items: center;
             gap: 8px;
          }
          .card-title {
             font-family: var(--font-display);
             font-size: 24px;
             color: var(--text-primary);
             margin-bottom: 12px;
          }
          .card-text {
             font-family: var(--font-body);
             font-size: 14px;
             color: var(--text-secondary);
             line-height: 1.6;
          }
          .data-ticker {
             margin-top: 16px;
             font-family: var(--font-mono);
             font-size: 10px;
             color: var(--teal-40);
             background: rgba(0,0,0,0.2);
             padding: 6px 12px;
             border-radius: 4px;
             overflow: hidden;
             white-space: nowrap;
          }
          .ticker-content {
             display: inline-block;
             padding-left: 100%;
             animation: tickerScroll 10s linear infinite;
          }
          @keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
       `}</style>

         <div className="matrix-container">

            {/* LEFT: MARKET & COMPETITORS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
               <div className="diagnostic-card" onMouseEnter={() => setHoveredNode('market')} onMouseLeave={() => setHoveredNode(null)}>
                  <div className="card-tag"><Activity size={12} /> THE MARKET</div>
                  <h3 className="card-title">Market Size.</h3>
                  <p className="card-text">See exactly how big your market is and how fast it is growing right now.</p>
                  <div className="data-ticker">
                     <div className="ticker-content">TOTAL MARKET: $12B | GROWTH: 18% | TREND: HIGH | ACCESS: READY</div>
                  </div>
               </div>

               <div className="diagnostic-card" onMouseEnter={() => setHoveredNode('competitor')} onMouseLeave={() => setHoveredNode(null)}>
                  <div className="card-tag"><Crosshair size={12} color="var(--danger)" /> THE RIVALS</div>
                  <h3 className="card-title">Competitors.</h3>
                  <p className="card-text">Find out what your rivals are doing and exactly where they are weak.</p>
                  <div className="data-ticker">
                     <div className="ticker-content" style={{ color: 'var(--danger)', opacity: 0.6 }}>RIVAL A: $450 VALUE | 2X RETURN | 6% LOSS | GAP FOUND</div>
                  </div>
               </div>
            </div>

            {/* CENTER: THE HUD & CORE */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTop: '2px solid var(--teal)', borderLeft: '2px solid var(--teal)' }} />
               <div style={{ position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTop: '2px solid var(--teal)', borderRight: '2px solid var(--teal)' }} />
               <div style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottom: '2px solid var(--teal)', borderLeft: '2px solid var(--teal)' }} />
               <div style={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottom: '2px solid var(--teal)', borderRight: '2px solid var(--teal)' }} />

               <canvas ref={canvasRef} style={{ width: '100%', height: 600, filter: hoveredNode === 'playbook' ? 'drop-shadow(0 0 60px rgba(255, 215, 0, 0.3))' : hoveredNode ? 'drop-shadow(0 0 40px var(--teal-25))' : 'none', transition: 'all 0.5s' }} />

               <div className="neo-terminal" style={{ position: 'absolute', bottom: 40, fontSize: 11, color: hoveredNode === 'playbook' ? '#FFD700' : 'var(--teal)' }}>
                  ARIA IS: {hoveredNode === 'market' ? 'SCANNING MARKET' : hoveredNode === 'competitor' ? 'SCANNING RIVALS' : hoveredNode === 'audience' ? 'SCANNING USERS' : hoveredNode === 'playbook' ? 'CREATING PLAN' : 'READY'}
               </div>
            </div>

            {/* RIGHT: AUDIENCE & PLAYBOOK (THE CLOSER) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
               <div className="diagnostic-card" onMouseEnter={() => setHoveredNode('audience')} onMouseLeave={() => setHoveredNode(null)}>
                  <div className="card-tag"><Users size={12} /> THE CUSTOMERS</div>
                  <h3 className="card-title">Audience.</h3>
                  <p className="card-text">Know exactly what your customers want and what they are looking for.</p>
                  <div className="data-ticker">
                     <div className="ticker-content">USER AGE: 24-35 | ISSUE: PRICING | NEED: FAST TOOLS</div>
                  </div>
               </div>

               <div className="diagnostic-card" style={{ border: '1px solid rgba(255, 215, 0, 0.2)' }} onMouseEnter={() => setHoveredNode('playbook')} onMouseLeave={() => setHoveredNode(null)}>
                  <div className="card-tag" style={{ color: '#FFD700' }}><BookOpen size={12} /> THE FINAL PLAN</div>
                  <h3 className="card-title" style={{ color: '#FFD700' }}>Your Strategy.</h3>
                  <p className="card-text">ARIA builds a complete, step-by-step roadmap to dominate your market.</p>
                  <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, color: '#FFD700', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                     GET FULL ACCESS <ChevronRight size={14} />
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
}
