import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2, TrendingUp, BarChart2, PieChart, Activity, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AriaLogo } from '../components/AriaLogo';

export default function ReportPage({ onNavigate, query, reportData }) {
  const displayQuery = query || "Global Market Overview";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      <div className="obsidian-grid" style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.3 }}></div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80vh', background: 'radial-gradient(circle at 50% 0%, rgba(15, 207, 188, 0.08) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }}></div>

      {/* --- TOP NAV --- */}
      <div style={{ width: '100%', boxSizing: 'border-box', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="nav-btn"
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{ height: 24, width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => onNavigate('landing')}>
            <AriaLogo height={60} width="auto" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="action-btn">
            <Share2 size={16} /> Share
          </button>
          <button className="action-btn-primary">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, padding: '48px 40px', position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        
        {/* Header Section */}
        <div className={`entry-anim ${mounted ? 'active' : ''}`} style={{ marginBottom: 48, transitionDelay: '0.1s' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(15, 207, 188, 0.1)', border: '1px solid var(--teal-25)', borderRadius: 24, color: 'var(--teal)', fontSize: 13, fontFamily: 'var(--font-body)', marginBottom: 24, boxShadow: '0 0 20px rgba(15, 207, 188, 0.1)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', boxShadow: '0 0 10px var(--teal)', animation: 'pulse 2s infinite' }}></span>
            Your Report is Ready
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 4vw, 64px)', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 16, textShadow: '0 0 40px rgba(255,255,255,0.1)' }}>
            {displayQuery}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-secondary)', maxWidth: 800, lineHeight: 1.6 }}>
            Comprehensive analysis including market sizing, competitive landscape, and predictive growth trajectories based on real-time data synthesis.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="bento-grid">
          
          {/* Quick Summary (Spans 2 cols) */}
          <div className={`bento-card bento-wide entry-anim ${mounted ? 'active' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="icon-box"><FileText size={18} color="var(--teal)" /></div>
                <h2 className="card-title">Quick Summary</h2>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
              {reportData?.market?.key_insight || `The ${displayQuery.toLowerCase()} sector is experiencing a paradigm shift driven by technological convergence and evolving consumer expectations. Early indicators suggest a compounding growth cycle, with significant capital flowing into infrastructure and localized solutions.`}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {reportData?.competitors?.differentiation || `Key barriers to entry remain regulatory compliance and initial capital expenditure, though established players are beginning to form strategic alliances to mitigate these risks. The next 18-24 months will be crucial for market consolidation.`}
            </p>
          </div>

          {/* Market Score (Spans 1 col, 2 rows) */}
          <div className={`bento-card bento-high entry-anim ${mounted ? 'active' : ''}`} style={{ transitionDelay: '0.3s', background: 'linear-gradient(145deg, rgba(15,207,188,0.05) 0%, rgba(10,10,10,0.8) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 className="card-title" style={{ width: '100%', textAlign: 'center', marginBottom: 40, marginTop: 20 }}>Market Score</h2>
            <div style={{ position: 'relative', width: 240, height: 240, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {/* Outer pulsing ring */}
              <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,207,188,0.15) 0%, transparent 70%)', animation: 'pulse 3s infinite' }}></div>
              
              <svg width="240" height="240" viewBox="0 0 240 240" style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 2 }}>
                <circle cx="120" cy="120" r="106" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <circle cx="120" cy="120" r="106" fill="none" stroke="var(--teal)" strokeWidth="12" strokeDasharray="666" strokeDashoffset={mounted ? "54" : "666"} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s', filter: 'drop-shadow(0 0 12px rgba(15, 207, 188, 0.6))' }} />
              </svg>
              
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 72, color: 'var(--text-primary)', lineHeight: 1, textShadow: '0 0 30px rgba(255,255,255,0.2)' }}>
                  {mounted ? (reportData?.market?.market_score || "75") : "0"}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--teal)', letterSpacing: 2, marginTop: 8, opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 1s' }}>
                  {Number(reportData?.market?.market_score || 75) > 80 ? "GREAT" : Number(reportData?.market?.market_score || 75) > 60 ? "GOOD" : "RISKY"}
                </span>
              </div>
            </div>
          </div>

          {/* Key Numbers (Spans 2 cols) */}
          <div className={`bento-card bento-wide entry-anim ${mounted ? 'active' : ''}`} style={{ transitionDelay: '0.4s' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="icon-box"><BarChart2 size={18} color="var(--teal)" /></div>
                <h2 className="card-title">Key Numbers</h2>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <MetricBox label="Total Market Size" value={reportData?.market?.market_size || "$124.5B"} trend="+14%" mounted={mounted} delay={500} />
              <MetricBox label="Audience Age" value={reportData?.audience?.demographics?.age_range || "25-45"} trend="Core" mounted={mounted} delay={600} />
              <MetricBox label="Cost per Customer" value={reportData?.market?.cost_per_customer || "$450"} trend="Est" positive={true} mounted={mounted} delay={700} />
              <MetricBox label="Time to Launch" value={reportData?.market?.time_to_launch || "8 mo"} trend="Avg" positive={true} mounted={mounted} delay={800} />
            </div>
          </div>

          {/* Why it's Growing */}
          <div className={`bento-card entry-anim ${mounted ? 'active' : ''}`} style={{ transitionDelay: '0.5s' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="icon-box"><Activity size={18} color="var(--teal)" /></div>
                <h2 className="card-title">Why it's Growing</h2>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {(reportData?.market?.growth_trends || ['New Laws Help Growth', 'Cheaper Shipping Costs', 'More People Buying']).map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle2 size={18} color="var(--teal)" style={{ marginTop: 2, flexShrink: 0, filter: 'drop-shadow(0 0 8px rgba(15,207,188,0.4))' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-secondary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Potential Risks */}
          <div className={`bento-card entry-anim ${mounted ? 'active' : ''}`} style={{ transitionDelay: '0.6s' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="icon-box" style={{ background: 'rgba(255, 60, 60, 0.1)', borderColor: 'rgba(255, 60, 60, 0.2)' }}><AlertTriangle size={18} color="#ff4a4a" /></div>
                <h2 className="card-title">Potential Risks</h2>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {(reportData?.market?.risks || ['Global Conflicts', 'Lack of Parts', 'Hard to Find Good Workers']).map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4a4a', marginTop: 6, flexShrink: 0, boxShadow: '0 0 10px rgba(255,60,60,0.6)' }}></div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-secondary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitive Landscape */}
          <div className={`bento-card entry-anim ${mounted ? 'active' : ''}`} style={{ transitionDelay: '0.7s' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="icon-box"><PieChart size={18} color="var(--teal)" /></div>
                <h2 className="card-title">Competitive Landscape</h2>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {(reportData?.competitors?.competitors || [
                { name: 'Market Leader', strength: 'Strong presence' },
                { name: 'Strong Competitor', strength: 'Good tech' },
                { name: 'Niche Player', strength: 'Targeted base' },
                { name: 'New Startups', strength: 'Agility' },
              ]).map((company, i) => {
                const colors = ['var(--teal)', '#4a90e2', '#9013fe', 'var(--text-secondary)'];
                const color = colors[i % colors.length];
                const share = [34, 28, 15, 23][i % 4];
                return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 140, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={company.name}>{company.name}</div>
                  <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ 
                      width: mounted ? `${share}%` : '0%', 
                      height: '100%', 
                      background: color, 
                      borderRadius: 4,
                      transition: `width 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.8 + (i * 0.1)}s`,
                      boxShadow: `0 0 10px ${color}`
                    }}></div>
                  </div>
                  <div style={{ width: 40, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>{share}%</div>
                </div>
              );})}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        /* BENTO GRID SYSTEM */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: minmax(min-content, max-content);
          gap: 24px;
        }
        @media(max-width: 1200px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr); }
          .bento-high { grid-row: auto; grid-column: span 2; }
          .bento-wide { grid-column: span 2; }
        }
        @media(max-width: 800px) {
          .bento-grid { grid-template-columns: 1fr; }
          .bento-high, .bento-wide { grid-column: span 1; }
        }

        .bento-card {
          background: rgba(14, 17, 23, 0.6);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
          box-shadow: inset 0 0 20px rgba(255,255,255,0.01), 0 20px 40px rgba(0,0,0,0.3);
        }
        .bento-card:hover {
          transform: translateY(-4px);
          box-shadow: inset 0 0 30px rgba(15, 207, 188, 0.03), 0 30px 60px rgba(0,0,0,0.5);
          border-color: rgba(255,255,255,0.1);
        }
        
        .bento-wide { grid-column: span 2; }
        .bento-high { grid-row: span 2; }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .card-title {
          font-family: var(--font-display);
          font-size: 22px;
          color: var(--text-primary);
          font-weight: 500;
          letter-spacing: -0.5px;
        }
        .icon-box {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--teal-12);
          border: 1px solid var(--teal-25);
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 15px rgba(15, 207, 188, 0.1);
        }

        /* Nav Buttons */
        .nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-secondary);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .nav-btn:hover {
          color: var(--text-primary);
          border-color: var(--teal-40);
          background: rgba(15,207,188,0.05);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-primary);
          padding: 10px 20px;
          border-radius: 12px;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .action-btn:hover {
          background: rgba(255,255,255,0.08);
        }
        
        .action-btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--teal-12);
          border: 1px solid var(--teal-25);
          color: var(--teal);
          padding: 10px 20px;
          border-radius: 12px;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .action-btn-primary:hover {
          background: var(--teal);
          color: var(--bg-primary);
          box-shadow: 0 0 20px rgba(15, 207, 188, 0.4);
        }

        /* Animations */
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.85); } }
        
        .entry-anim {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .entry-anim.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

// Subcomponent for Metric Boxes
function MetricBox({ label, value, trend, positive = undefined, mounted, delay }) {
  const isPositive = positive !== undefined ? positive : trend.startsWith('+');
  
  // Clean value defensively
  const safeValue = String(value || '--');
  const isLongValue = safeValue.length > 8;
  const isVeryLongValue = safeValue.length > 15;
  
  return (
    <div style={{ 
      background: 'rgba(255,255,255,0.02)', 
      border: '1px solid rgba(255,255,255,0.04)', 
      borderRadius: 16, 
      padding: '20px 24px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 12,
      position: 'relative',
      overflow: 'hidden',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(20px)',
      transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      height: '100%',
      minHeight: 140
    }}>
      {/* Background radial glow */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: isPositive ? 'radial-gradient(circle, rgba(15,207,188,0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(255,74,74,0.1) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
      
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', zIndex: 1, minHeight: 20 }}>{label}</div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, zIndex: 1, marginTop: 'auto' }}>
        <div style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: isVeryLongValue ? 16 : isLongValue ? 20 : 32, 
          color: 'var(--text-primary)', 
          lineHeight: 1.1,
          flex: '1 1 auto',
          wordBreak: 'break-word',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {safeValue}
        </div>
        
        {trend && trend !== 'Core' && trend !== '--' && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 6, 
            padding: '6px 10px', borderRadius: 8, 
            background: isPositive ? 'rgba(15, 207, 188, 0.1)' : 'rgba(255, 60, 60, 0.1)',
            color: isPositive ? 'var(--teal)' : '#ff4a4a',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            boxShadow: isPositive ? 'inset 0 0 10px rgba(15,207,188,0.05)' : 'inset 0 0 10px rgba(255,60,60,0.05)',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>
            <TrendingUp size={14} style={{ transform: isPositive ? 'none' : 'scaleY(-1)' }} />
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
