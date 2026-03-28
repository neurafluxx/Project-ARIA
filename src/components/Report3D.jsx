import { useState, useCallback, useEffect, useRef } from 'react';

export default function Report3D() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const frameRef = useRef(null);

  const handleMove = useCallback((e) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    
    frameRef.current = requestAnimationFrame(() => {
      const rect = e.currentTarget.getBoundingClientRect();
      // Calculate mouse position relative to center [-0.5 to 0.5]
      const px = (e.clientX - rect.left) / rect.width - 0.5; 
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Limit tilt to +/- 15 degrees for performance and elegant subtle movement
      setTilt({ x: px * 15, y: py * -15 });
    });
  }, []);

  useEffect(() => {
    return () => {
       if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div onMouseMove={handleMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
         style={{ width: '100%', height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1600, position: 'relative' }}>
       
       <style>{`
          .iso-layer { will-change: transform; transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
          .glow-text { animation: pulseText 2s infinite alternate; }
          @keyframes pulseText { 0% { opacity: 0.6; } 100% { opacity: 1; text-shadow: 0 0 10px var(--teal); } }
          @keyframes scanBeam { 0% { transform: translateY(-50px); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(400px); opacity: 0; } }
       `}</style>
       
       {/* Ambient Backlight (Static for performance) */}
       <div style={{ position: 'absolute', width: 300, height: 300, background: 'radial-gradient(circle, rgba(15,207,188,0.15) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

       {/* Master Isometric Container */}
       <div className="iso-layer" style={{
         position: 'relative', width: 320, height: 440,
         transformStyle: 'preserve-3d',
         // Base Isometric angle is (RotateX: 55deg, RotateZ: -25deg). Mouse adds slight parallax.
         transform: `rotateX(${55 + tilt.y}deg) rotateZ(${-25 + tilt.x}deg) translateZ(-40px)`,
       }}>

          {/* LAYER 0: The Base Document / Report Plate */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--teal-25)', borderRadius: 12,
            boxShadow: '-15px 25px 50px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(15,207,188,0.1)',
            overflow: 'hidden'
          }}>
             {/* Report Header */}
             <div style={{ padding: 24, borderBottom: '1px solid var(--teal-12)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                   <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--teal)', fontWeight: 600, marginBottom: 8 }}>INTELLIGENCE.PDF</div>
                   <div style={{ width: 140, height: 16, backgroundColor: 'var(--text-primary)', borderRadius: 2 }} />
                </div>
                <div style={{ width: 32, height: 32, border: '1px solid var(--teal-40)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div style={{ width: 16, height: 16, backgroundColor: 'var(--teal-25)', borderRadius: '50%' }} />
                </div>
             </div>
             
             {/* Abstract Grid Section (Simulating Market Data) */}
             <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                   <div style={{ width: '100%', height: 48, backgroundColor: 'rgba(250,250,250,0.03)', border: '1px solid var(--teal-12)', borderRadius: 4, marginBottom: 12 }} />
                   <div style={{ width: '80%', height: 6, backgroundColor: 'var(--teal-12)', borderRadius: 3, marginBottom: 8 }} />
                   <div style={{ width: '60%', height: 6, backgroundColor: 'var(--teal-12)', borderRadius: 3 }} />
                </div>
                <div>
                   <div style={{ width: '100%', height: 48, backgroundColor: 'rgba(250,250,250,0.03)', border: '1px dashed var(--danger-10)', borderRadius: 4, marginBottom: 12 }} />
                   <div style={{ width: '40%', height: 6, backgroundColor: 'var(--danger-10)', borderRadius: 3, marginBottom: 8 }} />
                   <div style={{ width: '90%', height: 6, backgroundColor: 'var(--teal-12)', borderRadius: 3 }} />
                </div>
             </div>

             {/* Chart Section */}
             <div style={{ padding: '0 24px', flex: 1 }}>
                <div style={{ width: '100%', height: 120, border: '1px solid var(--teal-12)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                   <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                     <path d="M0,90 L20,70 L40,80 L60,40 L80,50 L100,20" fill="none" stroke="var(--teal)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                     <path d="M0,100 L0,90 L20,70 L40,80 L60,40 L80,50 L100,20 L100,100 Z" fill="rgba(15, 207, 188, 0.1)" />
                   </svg>
                </div>
             </div>
          </div>

          {/* LAYER 1: 3D Data Extrusions (+40px Z) */}
          <div className="iso-layer" style={{
            position: 'absolute', inset: 0,
            transform: 'translateZ(40px)',
            pointerEvents: 'none' // Performance crucial
          }}>
             {/* 3D Bar Chart Beams rising up from the flat chart */}
             <div style={{ position: 'absolute', bottom: 120, left: 60, width: 24, height: 80, backgroundColor: 'rgba(15, 207, 188, 0.8)', boxShadow: '0 0 20px var(--teal)' }} />
             <div style={{ position: 'absolute', bottom: 120, left: 90, width: 24, height: 140, backgroundColor: 'var(--teal)', boxShadow: '0 0 30px var(--teal)' }} />
             <div style={{ position: 'absolute', bottom: 120, left: 120, width: 24, height: 50, backgroundColor: 'rgba(255, 77, 77, 0.8)', boxShadow: '0 0 20px var(--danger)' }} />
             
             {/* Floating UI Nodes wrapping the document */}
             <div style={{ position: 'absolute', top: 110, right: -60, padding: '8px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--teal)', borderRadius: 4, color: 'var(--teal)', fontSize: 10, fontWeight: 700, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                 <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--teal)' }} />
                 ANALYZING
             </div>
             
             <div style={{ position: 'absolute', bottom: 60, left: -40, padding: '8px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--danger)', borderRadius: 4, color: 'var(--danger)', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
                 COMPETITOR ID
             </div>
          </div>

          {/* LAYER 2: The Scanning Reticle (+80px Z) */}
          <div className="iso-layer" style={{
            position: 'absolute', inset: 0,
            transform: 'translateZ(80px)',
            pointerEvents: 'none',
            overflow: 'hidden' // Only show beam over the document bounds
          }}>
             <div style={{ width: '120%', height: 4, backgroundColor: 'rgba(15, 207, 188, 0.9)', marginLeft: '-10%', boxShadow: '0 0 30px var(--teal), 0 0 10px #fff', animation: 'scanBeam 4s ease-in-out infinite' }} />
          </div>

       </div>
    </div>
  );
}
