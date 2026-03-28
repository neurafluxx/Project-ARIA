import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Zap, Target, Code, Cpu, FileText, CheckCircle2 } from 'lucide-react';

export default function ProcessProcessor() {
  const [activeStage, setActiveStage] = useState(0);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  // --- Neural Synthesis (Canvas Particle Swarm) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 400;
    const height = canvas.height = 300;

    const particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.8 ? '#FF4D4D' : '#0FCFBC'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw Connections (Neural Mesh)
      ctx.strokeStyle = 'rgba(15, 207, 188, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      frameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 1400, margin: '40px auto 0', position: 'relative' }}>
        
        <style>{`
           .processor-panel {
             background: rgba(14, 17, 23, 0.4);
             border: 1px solid var(--teal-12);
             border-radius: 12px;
             backdrop-filter: blur(20px);
             padding: 40px;
             transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
             position: relative;
             overflow: hidden;
             flex: 1;
           }
           .processor-panel:hover {
             border-color: var(--teal-40);
             box-shadow: 0 40px 100px rgba(0,0,0,0.8), inset 0 0 40px rgba(15, 207, 188, 0.05);
           }
           .stage-number {
              font-family: var(--font-mono);
              font-size: 12px;
              letter-spacing: 4px;
              color: var(--teal-40);
              margin-bottom: 24px;
           }
           .stage-title {
              font-family: var(--font-display);
              font-size: 36px;
              color: var(--text-primary);
              margin-bottom: 16px;
           }
           .stage-description {
              font-family: var(--font-body);
              font-size: 16px;
              color: var(--text-secondary);
              max-width: 360px;
              line-height: 1.6;
           }

           /* --- CRT TERMINAL EFFECTS --- */
           .crt-terminal {
              margin-top: 40px;
              padding: 24px;
              background: #05070A;
              border: 1px solid var(--teal-25);
              border-radius: 8px;
              position: relative;
              overflow: hidden;
           }
           .crt-terminal::before {
              content: "";
              position: absolute;
              top: 0; left: 0; width: 100%; height: 100%;
              background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), 
                          linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
              background-size: 100% 2px, 2px 100%;
              pointer-events: none;
              z-index: 1;
              opacity: 0.5;
           }
           .terminal-text {
              font-family: var(--font-mono);
              font-size: 14px;
              color: #A7FFEF; /* Ultra Bright Teal */
              font-weight: 600;
              position: relative;
              z-index: 2;
              opacity: 1;
              white-space: nowrap;
              overflow: hidden;
              border-right: 2px solid var(--teal);
              width: fit-content;
              animation: typing 3s steps(30) infinite, blink 0.8s step-end infinite;
              text-shadow: 0 0 10px rgba(167, 255, 239, 0.3);
           }
           @keyframes typing { from { width: 0; } to { width: 100%; } }
           @keyframes blink { 50% { border-color: transparent; } }

           /* --- HOLOGRAPHIC RESULT VISUALS --- */
           .result-preview-container {
              margin-top: 40px;
              height: 240px;
              position: relative;
              display: flex;
              justify-content: center;
              perspective: 1200px;
           }
           .holo-card {
              position: absolute;
              width: 150px;
              height: 200px;
              background: rgba(14, 17, 23, 0.8);
              border: 1px solid var(--teal-25);
              border-radius: 4px;
              backdrop-filter: blur(10px);
              transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
              display: flex;
              flex-direction: column;
              padding: 16px;
           }
           .holo-card::after {
              content: "";
              position: absolute;
              top: 0; left: 0; width: 100%; height: 2px;
              background: var(--teal);
              box-shadow: 0 0 15px var(--teal);
              opacity: 0.3;
              animation: scanlineMove 4s infinite linear;
              z-index: 3;
           }
           @keyframes scanlineMove { 0% { top: 0; } 100% { top: 100%; } }

           .holo-card:nth-child(1) { transform: rotateY(-15deg) rotateX(15deg) translateZ(60px); z-index: 10; border-color: var(--teal); }
           .holo-card:nth-child(2) { transform: rotateY(-15deg) rotateX(15deg) translateZ(30px) translateX(25px) translateY(-15px); z-index: 9; opacity: 0.6; }
           .holo-card:nth-child(3) { transform: rotateY(-15deg) rotateX(15deg) translateZ(0px) translateX(50px) translateY(-30px); z-index: 8; opacity: 0.3; }

           .processor-panel:hover .holo-card:nth-child(1) { transform: rotateY(0deg) rotateX(0deg) translateZ(80px); }
           .processor-panel:hover .holo-card:nth-child(2) { transform: rotateY(0deg) rotateX(0deg) translateZ(40px) translateX(40px) translateY(-20px); }
           .processor-panel:hover .holo-card:nth-child(3) { transform: rotateY(0deg) rotateX(0deg) translateZ(0px) translateX(80px) translateY(-40px); }

           .holo-line { height: 4px; background: var(--teal-12); margin-bottom: 10px; border-radius: 2px; }
           .holo-line-80 { width: 80%; }
           .holo-line-50 { width: 50%; }
           .holo-line-active { background: var(--teal-25); width: 100%; }

           .success-badge {
              position: absolute;
              bottom: 20px;
              right: 20px;
              padding: 12px;
              background: var(--bg-primary);
              border: 1px solid var(--teal);
              border-radius: 50%;
              box-shadow: 0 0 30px var(--teal-25);
              z-index: 20;
              animation: pulseBadge 2s infinite ease-in-out;
           }
           @keyframes pulseBadge { 0%, 100% { transform: scale(1); box-shadow: 0 0 10px var(--teal-25); } 50% { transform: scale(1.1); box-shadow: 0 0 40px var(--teal-40); } }

           .data-particles {
              position: absolute;
              width: 100%; height: 100%;
              pointer-events: none;
              z-index: 1;
           }
        `}</style>

        {/* --- THE MASTER PROCESSOR --- */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'stretch' }}>
           
           {/* STAGE 01: YOUR IDEA */}
           <div className="processor-panel" onMouseEnter={() => setActiveStage(1)}>
               <div className="stage-number">STEP 01</div>
               <h3 className="stage-title">Your Idea.</h3>
               <p className="stage-description">Just type in your business idea. ARIA reads it and gets ready to work instantly.</p>
               
               {/* Terminal Simulation */}
               <div className="crt-terminal">
                  <div className="terminal-text">&gt; Starting search...</div>
                  <div style={{ marginTop: 12, height: 2, width: '100%', backgroundColor: 'rgba(15, 207, 188, 0.1)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: '70%', backgroundColor: 'var(--teal)', boxShadow: '0 0 15px var(--teal)', transition: 'width 2s ease-in-out' }} />
                  </div>
                  <div style={{ marginTop: 12, fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--teal-40)', letterSpacing: 1 }}>
                    READY TO GO | 99% ACCURACY | ALWAYS ON
                  </div>
               </div>
           </div>

           {/* STAGE 02: ARIA RESEARCHES */}
           <div className="processor-panel" style={{ textAlign: 'center', backgroundColor: 'rgba(15, 207, 188, 0.03)', border: '1px solid var(--teal-25)', flex: 1.2 }} onMouseEnter={() => setActiveStage(2)}>
               <div className="stage-number">STEP 02</div>
               <h3 className="stage-title">Research.</h3>
               
               <div style={{ position: 'relative', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
                    <canvas ref={canvasRef} style={{ width: '100%', maxWidth: 400, height: 300 }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Cpu size={56} color="var(--teal)" style={{ opacity: 0.4, animation: 'neoFlicker 2s infinite' }} />
                    </div>
               </div>
               
               <p className="stage-description" style={{ margin: '0 auto', maxWidth: 400 }}>ARIA scans the entire web to find your competitors and true market data.</p>
           </div>

           {/* STAGE 03: GET THE REPORT */}
           <div className="processor-panel" onMouseEnter={() => setActiveStage(3)}>
               <div className="stage-number">STEP 03</div>
               <h3 className="stage-title">Get Results.</h3>
               <p className="stage-description">Get a clear, professional report with everything you need to start your business.</p>
               
               {/* Holographic Result Visualization */}
               <div className="result-preview-container">
                    <div className="holo-card">
                       <div className="holo-line holo-line-active" />
                       <div className="holo-line holo-line-80" />
                       <div className="holo-line holo-line-80" />
                       <div className="holo-line holo-line-50" />
                       <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <CheckCircle2 size={14} color="var(--teal)" />
                          <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--teal-40)' }}>VERIFIED.</div>
                       </div>
                    </div>
                    <div className="holo-card" />
                    <div className="holo-card" />
                    
                    <div className="success-badge">
                       <FileText size={28} color="var(--teal)" />
                    </div>
               </div>
           </div>

        </div>

        {/* Ticker of Activity Status */}
        <div style={{ marginTop: 24, padding: '12px 24px', backgroundColor: 'rgba(15, 207, 188, 0.05)', border: '1px solid var(--teal-25)', boxShadow: '0 0 20px rgba(15, 207, 188, 0.1)', borderRadius: 100, width: 'fit-content', margin: '20px auto 40px', display: 'flex', alignItems: 'center', gap: 12 }}>
           <div style={{ width: 8, height: 8, backgroundColor: 'var(--teal)', borderRadius: '50%', boxShadow: '0 0 10px var(--teal)', animation: 'pulseText 1s infinite alternate' }} />
           <span className="neo-terminal" style={{ fontSize: 10, letterSpacing: 2 }}>ARIA IS: {activeStage === 0 ? 'READY' : activeStage === 1 ? 'READING IDEA' : activeStage === 2 ? 'FINDING DATA' : 'MAKING REPORT'}</span>
        </div>
    </div>
  );
}
