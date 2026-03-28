import { useState, useCallback } from 'react';

export default function ProcessOrb() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 140; // Intense rotation control
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -140;
    setTilt({ x, y });
  }, []);

  // 14 concentric aperture rings
  const rings = Array.from({ length: 14 }).map((_, i) => {
    const size = 320 - (i * 20); // Down to 60px
    const isPrimary = i % 4 === 0;
    const isSecondary = i % 3 === 0;
    
    // Telescopes heavily on hover
    const zOffset = hovering ? (200 - (i * 30)) : 0;
    const dir = i % 2 === 0 ? 1 : -1;
    const duration = 15 + (i * 2);
    
    return (
      <div key={i} style={{
        position: 'absolute', top: '50%', left: '50%',
        width: size, height: size,
        marginLeft: -(size/2), marginTop: -(size/2),
        transformStyle: 'preserve-3d',
        transform: `translateZ(${zOffset}px) rotateZ(${hovering ? (i * 20) : 0}deg)`,
        transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
         {/* Inner Ring handles the infinite rotation */}
         <div style={{
           width: '100%', height: '100%', borderRadius: '50%', position: 'relative',
           border: isPrimary ? '1px solid var(--teal)' : isSecondary ? '1px dashed var(--danger)' : '1px solid var(--teal-25)',
           boxShadow: (hovering && isPrimary) ? 'inset 0 0 30px rgba(15, 207, 188, 0.4), 0 0 30px rgba(15, 207, 188, 0.4)' : 'none',
           animation: `spinRing ${duration}s linear infinite ${dir > 0 ? 'normal' : 'reverse'}`,
           transition: 'box-shadow 1s'
         }}>
             {/* Data Nodes attached directly to ring edge */}
             {isPrimary && <div style={{ width: 8, height: 8, backgroundColor: 'var(--teal)', borderRadius: '50%', position: 'absolute', top: -4, left: '50%', marginLeft: -4, boxShadow: '0 0 15px var(--teal)' }} />}
             {isSecondary && <div style={{ width: 4, height: 16, backgroundColor: 'var(--danger)', position: 'absolute', bottom: -8, left: '50%', marginLeft: -2, boxShadow: '0 0 15px var(--danger)' }} />}
         </div>
      </div>
    );
  });

  return (
    <div onMouseMove={handleMove} 
         onMouseEnter={() => setHovering(true)}
         onMouseLeave={() => { setHovering(false); setTilt({ x: 0, y: 0 }); }}
         style={{ width: '100%', height: 440, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1800, cursor: 'crosshair' }}>
       
       <style>{`
          @keyframes spinRing { 100% { transform: rotate(360deg); } }
          @keyframes spinAperture { 100% { transform: rotate(360deg); } }
          @keyframes pulseCore {
             0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 60px var(--teal), inset 0 0 30px var(--teal); }
             50% { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 100px var(--teal), inset 0 0 50px #fff; }
          }
       `}</style>
       
       <div style={{
         position: 'relative', width: 320, height: 320,
         transformStyle: 'preserve-3d',
         transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
         transition: 'transform 0.2s ease-out'
       }}>
          
          {rings}

          {/* Core Singularity */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%', zIndex: 10,
            width: 40, height: 40, borderRadius: '50%',
            backgroundColor: 'var(--bg-primary)', border: '2px solid var(--teal)',
            transform: `translate(-50%, -50%) translateZ(${hovering ? -220 : 0}px)`,
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: hovering ? 'pulseCore 1.5s ease-in-out infinite' : 'none'
          }}>
             <div style={{ position: 'absolute', inset: 6, backgroundColor: 'var(--teal)', borderRadius: '50%', filter: 'blur(4px)' }} />
          </div>

          {/* Frame Reticle */}
          <div style={{
            position: 'absolute', inset: -30, borderRadius: '50%',
            borderTop: '2px solid var(--danger)', borderBottom: '2px dashed var(--teal)',
            borderLeft: '2px solid transparent', borderRight: '2px solid transparent',
            animation: 'spinAperture 10s linear infinite', opacity: hovering ? 1 : 0.3, transition: 'opacity 1s'
          }} />

          {/* Deep Z-axis Laser Beam */}
          <div style={{
             position: 'absolute', left: '50%', top: '50%',
             width: 4, height: 800, marginLeft: -2, marginTop: -400,
             background: 'linear-gradient(to bottom, transparent, var(--danger) 50%, transparent)',
             transform: 'rotateX(90deg)',
             opacity: hovering ? 0.9 : 0, filter: 'blur(3px)',
             transition: 'opacity 0.6s', pointerEvents: 'none'
          }} />

       </div>
    </div>
  );
}
