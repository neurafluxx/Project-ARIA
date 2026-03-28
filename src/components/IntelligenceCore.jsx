import { useState, useCallback } from 'react';
import { Compass, Target, Users } from 'lucide-react';

export default function IntelligenceCore() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 60; 
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -60;
    setTilt({ x, y });
  }, []);

  return (
    <div onMouseMove={handleMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
         style={{ width: '100%', height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 2000 }}>
       
       <style>{`
          @keyframes floatData1 { 0%, 100% { transform: translateZ(50px) translateY(0) rotateY(15deg); } 50% { transform: translateZ(60px) translateY(-15px) rotateY(10deg); } }
          @keyframes floatData2 { 0%, 100% { transform: translateZ(80px) translateY(0) rotateY(-20deg); } 50% { transform: translateZ(90px) translateY(-20px) rotateY(-15deg); } }
          @keyframes floatData3 { 0%, 100% { transform: translateZ(120px) translateY(0) rotateX(15deg); } 50% { transform: translateZ(130px) translateY(-10px) rotateX(25deg); } }
          @keyframes orbitBrain { 0% { transform: rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateY(360deg) rotateZ(360deg); } }
          @keyframes pulseMesh { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
       `}</style>
       
       {/* Main 3D Container tracking mouse */}
       <div style={{
         position: 'relative', width: 400, height: 400,
         transformStyle: 'preserve-3d',
         transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
         transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
       }}>

          {/* ARIA Artificial Brain Core */}
          <div style={{
             position: 'absolute', top: '50%', left: '50%',
             width: 160, height: 160, marginLeft: -80, marginTop: -80,
             transformStyle: 'preserve-3d',
             animation: 'orbitBrain 24s linear infinite'
          }}>
             {/* Glowing Engine Orb */}
             <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: 'radial-gradient(circle, var(--teal) 0%, transparent 60%)', filter: 'blur(30px)', opacity: 0.5, animation: 'pulseMesh 4s ease-in-out infinite' }} />
             
             {/* 3D Wireframe globe / neural node */}
             {Array.from({ length: 4 }).map((_, i) => (
               <div key={`y${i}`} style={{
                 position: 'absolute', inset: 0, borderRadius: '50%',
                 border: '1px solid var(--teal-12)',
                 transform: `rotateY(${i * 45}deg)`,
               }} />
             ))}
             {Array.from({ length: 4 }).map((_, i) => (
               <div key={`x${i}`} style={{
                 position: 'absolute', inset: 0, borderRadius: '50%',
                 border: '1px dashed var(--teal-25)',
                 transform: `rotateX(90deg) rotateY(${i * 45}deg)`,
               }} />
             ))}

             {/* Central Processing Singularity */}
             <div style={{ position: 'absolute', top: '50%', left: '50%', width: 32, height: 32, marginLeft: -16, marginTop: -16, backgroundColor: 'var(--teal)', borderRadius: '50%', boxShadow: '0 0 50px var(--teal)', animation: 'pulseMesh 2s infinite' }} />
          </div>

          {/* ════ 3D FLOATING DATA CARDS EXTRACTED BY THE AI ════ */}
          
          {/* Card 1: Market Intelligence (Top Left) */}
          <div style={{
             position: 'absolute', top: 20, left: -100,
             width: 200, padding: 20, borderRadius: 12,
             backgroundColor: 'rgba(14, 17, 23, 0.6)', backdropFilter: 'blur(16px)',
             border: '1px solid var(--teal-25)',
             boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(15, 207, 188, 0.15)',
             animation: 'floatData1 6s ease-in-out infinite',
             transformStyle: 'preserve-3d', zIndex: 10
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Compass size={18} color="var(--teal)" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', letterSpacing: 1.5 }}>MARKET NAV</span>
             </div>
             <div style={{ fontSize: 32, fontFamily: 'Playfair Display', color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1 }}>$4.2B</div>
             {/* Mini Live Chart */}
             <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 48 }}>
                <div style={{ width: '25%', height: '40%', backgroundColor: 'var(--teal-25)', borderRadius: 2 }} />
                <div style={{ width: '25%', height: '55%', backgroundColor: 'var(--teal-40)', borderRadius: 2 }} />
                <div style={{ width: '25%', height: '75%', backgroundColor: 'var(--teal)', borderRadius: 2 }} />
                <div style={{ width: '25%', height: '100%', backgroundColor: 'var(--teal)', borderRadius: 2, boxShadow: '0 0 16px var(--teal)' }} />
             </div>
          </div>

          {/* Card 2: Competitor Matrix (Bottom Left) */}
          <div style={{
             position: 'absolute', bottom: 20, left: -60,
             width: 200, padding: 20, borderRadius: 12,
             backgroundColor: 'rgba(14, 17, 23, 0.6)', backdropFilter: 'blur(16px)',
             border: '1px solid var(--danger)',
             boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(255, 77, 77, 0.15)',
             animation: 'floatData2 8s ease-in-out infinite', animationDelay: '1s',
             transformStyle: 'preserve-3d', zIndex: 15
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Target size={18} color="var(--danger)" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', letterSpacing: 1.5 }}>RIVAL NODE</span>
             </div>
             {/* Matrix Grid revealing competitor weakness */}
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                <div style={{ height: 32, border: '1px solid var(--danger)', borderRadius: 6, backgroundColor: 'var(--danger-10)' }} />
                <div style={{ height: 32, border: '1px solid var(--danger)', borderRadius: 6, backgroundColor: 'var(--danger-10)' }} />
                <div style={{ height: 32, border: '1px solid var(--teal)', borderRadius: 6, backgroundColor: 'var(--teal-12)', boxShadow: '0 0 20px var(--teal)' }} />
                <div style={{ height: 32, border: '1px solid var(--danger)', borderRadius: 6, backgroundColor: 'var(--danger-10)' }} />
             </div>
          </div>

          {/* Card 3: Audience Demographics (Right Center) */}
          <div style={{
             position: 'absolute', top: 100, right: -120,
             width: 240, padding: 20, borderRadius: 12,
             backgroundColor: 'rgba(14, 17, 23, 0.6)', backdropFilter: 'blur(16px)',
             border: '1px solid var(--teal-40)',
             boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(15, 207, 188, 0.05)',
             animation: 'floatData3 7s ease-in-out infinite', animationDelay: '2s',
             transformStyle: 'preserve-3d', zIndex: 20, overflow: 'hidden'
          }}>
             {/* Scanning Line overlay */}
             <div style={{ position: 'absolute', width: '100%', height: 2, backgroundColor: 'var(--teal)', left: 0, top: '50%', boxShadow: '0 0 20px var(--teal)', opacity: 0.5 }} />
             
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Users size={18} color="var(--teal)" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: 1.5 }}>AUDIENCE DEMO</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--teal)' }} />
                   <div style={{ flex: 1, margin: '0 12px', height: 6, backgroundColor: 'var(--teal-12)', borderRadius: 3 }}><div style={{ width: '85%', height: '100%', backgroundColor: 'var(--teal)', borderRadius: 3, boxShadow: '0 0 10px var(--teal)' }} /></div>
                   <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>85%</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px dotted var(--teal)' }} />
                   <div style={{ flex: 1, margin: '0 12px', height: 6, backgroundColor: 'var(--teal-12)', borderRadius: 3 }}><div style={{ width: '40%', height: '100%', backgroundColor: 'var(--teal-40)', borderRadius: 3 }} /></div>
                   <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>40%</div>
                </div>
             </div>
          </div>

          {/* Holographic Input Text (Represents the user Prompt feeding the AI Engine) */}
          <div style={{
             position: 'absolute', bottom: -100, left: '50%', marginLeft: -160,
             width: 320, textAlign: 'center',
             transform: 'translateZ(100px)',
             color: 'var(--teal)', fontFamily: 'Outfit', fontSize: 16, letterSpacing: 1,
             textShadow: '0 0 15px var(--teal)', opacity: 0.9
          }}>
             &gt; Searching live market endpoints...
             <div style={{ height: 1, width: '100%', backgroundColor: 'var(--teal-40)', marginTop: 12, boxShadow: '0 0 10px var(--teal)' }} />
          </div>

       </div>
    </div>
  );
}
