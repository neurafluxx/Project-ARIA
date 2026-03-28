import { useEffect, useRef } from 'react';

export default function AIGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 600;
    const height = canvas.height = 600;

    const particles = [];
    const numParticles = 800; 
    const radius = 220;

    // Mathematical Fibonacci sphere distribution for perfectly even mapping
    const phi = Math.PI * (3 - Math.sqrt(5)); 
    
    for (let i = 0; i < numParticles; i++) {
       const y = 1 - (i / (numParticles - 1)) * 2; 
       const radiusAtY = Math.sqrt(1 - y * y); 
       const theta = phi * i; 

       // 3D coordinates mapped to a unit sphere
       const x = Math.cos(theta) * radiusAtY;
       const z = Math.sin(theta) * radiusAtY;

       particles.push({
          x0: x, y0: y, z0: z,
          // 5% of nodes are 'Special Intel Nodes'
          isSpecial: Math.random() > 0.95,
          color: Math.random() > 0.7 ? '#FF4D4D' : '#0FCFBC', // Danger Red or Electric Teal
          offset: Math.random() * 100 // Phase offset for pulsing
       });
    }

    let rotationX = 0;
    let rotationY = 0;
    let targetRotationX = 0.5;
    let targetRotationY = 0;
    
    const handleMouseMove = (e) => {
       const rect = canvas.getBoundingClientRect();
       const mx = (e.clientX - rect.left) / rect.width - 0.5;
       const my = (e.clientY - rect.top) / rect.height - 0.5;
       targetRotationY = mx * Math.PI; // Full 180 deg control
       targetRotationX = my * Math.PI * 0.5; // Slight vertical tilt
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    let frameId;
    let time = 0;

    const render = () => {
       time += 0.005;
       
       // Smooth inertia easing to target rotation
       rotationX += (targetRotationX - rotationX) * 0.05;
       rotationY += (targetRotationY + time - rotationY) * 0.05; // Auto rotate + mouse

       ctx.clearRect(0, 0, width, height);
       const cx = width / 2;
       const cy = height / 2;

       // Math to project 3D points
       const projected = [];
       for(let i=0; i<numParticles; i++) {
          const p = particles[i];
          
          // Rotate X
          const y1 = p.y0 * Math.cos(rotationX) - p.z0 * Math.sin(rotationX);
          const z1 = p.y0 * Math.sin(rotationX) + p.z0 * Math.cos(rotationX);
          
          // Rotate Y
          const x2 = p.x0 * Math.cos(rotationY) + z1 * Math.sin(rotationY);
          const z2 = z1 * Math.cos(rotationY) - p.x0 * Math.sin(rotationY);
          
          // Breathe / Pulse effect natively tied to the mesh
          const pulse = Math.sin(time * 10 + p.offset) * (p.isSpecial ? 12 : 2);
          const currentRadius = radius + pulse;

          const px = cx + x2 * currentRadius;
          const py = cy + y1 * currentRadius;
          const scale = (z2 + 2) / 3; // Depth scaling (closer = bigger)

          projected.push({
             x: px, y: py, z: z2, scale: scale, isSpecial: p.isSpecial, color: p.color
          });
       }

       // Core logic: Sort by Z-index so furthest dots render first (proper 3D occlusion)
       projected.sort((a,b) => a.z - b.z);

       for(let i=0; i<projected.length; i++) {
          const pt = projected[i];
          
          // Fade points curving toward the back of the sphere
          const baseOpacity = Math.max(0.1, (pt.z + 1) / 2);
          
          if (pt.isSpecial) {
             // Glow effect for special Intel Nodes
             ctx.beginPath();
             ctx.arc(pt.x, pt.y, pt.scale * 3.5, 0, Math.PI * 2);
             ctx.fillStyle = pt.color;
             ctx.shadowBlur = 15;
             ctx.shadowColor = pt.color;
             ctx.globalAlpha = baseOpacity * 1.5;
             ctx.fill();
             
             // Draw connecting reticles / crosshairs across special data nodes
             ctx.beginPath();
             const ret = 12 * pt.scale;
             ctx.moveTo(pt.x - ret, pt.y); ctx.lineTo(pt.x + ret, pt.y);
             ctx.moveTo(pt.x, pt.y - ret); ctx.lineTo(pt.x, pt.y + ret);
             ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity * 0.8})`;
             ctx.lineWidth = 1;
             ctx.shadowBlur = 0;
             ctx.stroke();

          } else {
             // Standard neural point
             ctx.beginPath();
             ctx.arc(pt.x, pt.y, pt.scale * 1.5, 0, Math.PI * 2);
             ctx.fillStyle = '#0FCFBC';
             ctx.globalAlpha = baseOpacity * 0.5;
             ctx.shadowBlur = 0;
             ctx.fill();
          }
       }
       
       // High-Tech Equatorial Scanning Rings wrapping the sphere
       ctx.save();
       ctx.translate(cx, cy);
       ctx.rotate(rotationX * 0.5); // Tilt ring slightly based on mouse Y
       ctx.scale(1, 0.2); // Squeeze it into deep isometric 3D space
       
       ctx.beginPath();
       ctx.arc(0, 0, radius + 40, 0, Math.PI * 2);
       ctx.strokeStyle = 'rgba(15, 207, 188, 0.1)';
       ctx.lineWidth = 2;
       ctx.stroke();
       
       // Animated Danger Red orbital laser scanning along the ring
       ctx.beginPath();
       ctx.arc(0, 0, radius + 40, time*3, (time*3) + Math.PI/2); // Sweeps a 90-degree arc
       ctx.strokeStyle = '#FF4D4D'; 
       ctx.lineWidth = 4;
       ctx.shadowBlur = 20;
       ctx.shadowColor = '#FF4D4D';
       ctx.stroke();
       ctx.restore();

       frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
       cancelAnimationFrame(frameId);
       canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
     <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <canvas 
           ref={canvasRef} 
           style={{ 
              width: '100%', 
              maxWidth: 600, 
              height: 600, 
              // Very cheap CSS shadow that doesn't trigger reflows
              filter: 'drop-shadow(0 0 60px rgba(15, 207, 188, 0.1))',
              cursor: 'crosshair'
           }} 
        />
        
        <div className="neo-terminal" style={{
           position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
           textAlign: 'center', fontSize: 13,
           display: 'flex', gap: 12, alignItems: 'center'
        }}>
           <div style={{ width: 6, height: 6, backgroundColor: 'var(--danger)', borderRadius: '50%', boxShadow: '0 0 10px var(--danger)', animation: 'pulseText 1s infinite alternate' }} />
           GLOBAL MARKET SCAN IN PROGRESS
        </div>
     </div>
  );
}
