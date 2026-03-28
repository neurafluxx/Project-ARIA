import { ArrowRight, Compass, Target, Users, Code, Zap } from 'lucide-react';
import HeroVisual from '../components/HeroOrb';
import IntelligenceMatrix from '../components/IntelligenceMatrix';
import ProcessProcessor from '../components/ProcessProcessor';
import { AriaLogo } from '../components/AriaLogo';

export default function LandingPage({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
      <div className="obsidian-grid"></div>

      {/* ════ NAV ════ */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid var(--teal-12)', backgroundColor: 'rgba(8, 9, 12, 0.85)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'stretch', height: '80px' }}>
          {/* Logo */}
          <div style={{ padding: '0 var(--space-4)', display: 'flex', alignItems: 'center', height: '100%' }}>
            <AriaLogo height="100%" width="auto" style={{ maxHeight: '60px' }} />
          </div>

          <div className="dn" style={{ flex: 1, display: 'flex', borderLeft: '1px solid var(--teal-12)' }}>
            {['How It Works', 'What You Get', 'Access'].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '')}`} className="text-label" style={{ padding: '0 var(--space-4)', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', textDecoration: 'none', borderRight: '1px solid var(--teal-12)', fontSize: 13 }}>
                {l}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-4)', gap: 'var(--space-2)' }}>
            <button onClick={() => onNavigate('login')} className="obs-btn-ghost">
              Login
            </button>
            <button onClick={() => onNavigate('register')} className="obs-btn-primary">
              Start Now
            </button>
          </div>
        </div>
      </nav>

      {/* ════ HERO ════ */}
      <section style={{ paddingTop: '160px', paddingBottom: 'var(--space-8)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 var(--space-4)' }}>
          <div className="hg" style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
            <div>
              <div className="obs-pill-danger" style={{ marginBottom: 'var(--space-4)' }}>Try it out now</div>

              <h1 className="heading-display" style={{ marginBottom: 'var(--space-3)' }}>
                Understand <br />
                <span style={{ color: 'var(--teal)' }}>Your Market.</span>
              </h1>

              <p className="text-body" style={{ fontSize: 18, maxWidth: 540, marginBottom: 'var(--space-4)' }}>
                Stop relying on guesswork. Type in a business idea, and ARIA gathers the exact data you need to succeed in under 30 seconds.
              </p>

              <button onClick={() => onNavigate('register')} className="obs-btn-primary" style={{ padding: 'var(--space-2) var(--space-6)', fontSize: 16 }}>
                Get Started <ArrowRight size={20} style={{ marginLeft: 12 }} />
              </button>
            </div>

            <div className="su ho">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ════ TICKER ════ */}
      <section style={{ borderTop: '1px solid var(--teal-12)', borderBottom: '1px solid var(--teal-12)', backgroundColor: 'var(--bg-secondary)', padding: 'var(--space-2) 0', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', width: '200%', animation: 'marqueeLeft 20s linear infinite' }}>
          {[1, 2, 3, 4].map(k => (
            <div key={k} style={{ display: 'flex', alignItems: 'center' }}>
              {['FAST RESEARCH', 'COMPETITOR DATA', 'TARGET AUDIENCE', 'EASY PLANS'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="text-label" style={{ padding: '0 var(--space-6)', color: 'var(--teal)' }}>{t}</span>
                  <div style={{ width: 4, height: 4, backgroundColor: 'var(--teal)', borderRadius: '50%' }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ════ HOW IT WORKS (The ARIA Processor) ════ */}
      <section id="howitworks" style={{ padding: '60px 0 0', position: 'relative', zIndex: 1, backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--teal-12)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 var(--space-4)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 className="heading-page" style={{ fontSize: 64, marginBottom: 'var(--space-2)' }}>The Process.</h2>
            <p className="text-body" style={{ maxWidth: 600, margin: '0 auto' }}>A multi-tiered kinetic pipeline designed to synthesize market intelligence in real-time.</p>
          </div>

          <ProcessProcessor />
        </div>
      </section>

      {/* ════ THE STRATEGY ENGINE (How You Win) ════ */}
      <section id="whatyouget" style={{ padding: '0', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 var(--space-4)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <div className="obs-pill" style={{ marginBottom: 'var(--space-4)', marginTop: '40px' }}>How You Win</div>
            <h2 className="heading-page" style={{ fontSize: 80, marginBottom: 'var(--space-2)' }}>Find Your <span style={{ color: 'var(--teal)' }}>Path.</span></h2>
            <p className="text-body" style={{ maxWidth: 600, margin: '0 auto', fontSize: 18 }}>ARIA turns market data into a clear plan for your success.</p>
          </div>

          <IntelligenceMatrix />
        </div>
      </section>

      {/* ════ THE SUCCESS PANEL (ACCESS) ════ */}
      <section id="access" style={{ padding: '40px 0 120px', position: 'relative', zIndex: 1, backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 var(--space-4)' }}>
          
          {/* Ambient Soft Glows behind the card */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 600, height: 400, background: 'var(--teal-06)', borderRadius: '50%', filter: 'blur(120px)', transform: 'translate(-50%, -50%)', zIndex: -1 }} />

          <div style={{
            background: 'rgba(14, 17, 23, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--teal-12)',
            borderRadius: 40,
            padding: 'var(--space-8) var(--space-4)',
            textAlign: 'center',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h2 className="heading-display" style={{ marginBottom: 'var(--space-3)', fontSize: 'clamp(48px, 6vw, 72px)' }}>
              Ready to <span style={{ color: 'var(--teal)' }}>Start?</span>
            </h2>
            
            <p className="text-body" style={{ marginBottom: 'var(--space-6)', fontSize: 20, maxWidth: 540, margin: '0 auto var(--space-6)' }}>
              Build your business today with ARIA. <br />
              No more guessing. Just real data in seconds.
            </p>
            
            <button onClick={() => onNavigate('register')} className="obs-btn-primary" 
              style={{ padding: '20px 48px', fontSize: 18, borderRadius: 100, background: 'var(--teal)', color: 'var(--bg-primary)', fontWeight: 600 }}>
              Start My Search <ArrowRight size={22} style={{ marginLeft: 12 }}/>
            </button>
          </div>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer style={{ borderTop: '1px solid var(--teal-12)', padding: 'var(--space-6) 0', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AriaLogo height={80} width={280} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            {['Terms', 'Privacy', 'Status'].map(l => (
              <a key={l} href="#" className="text-small" style={{ textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @media(min-width: 901px) { .dn { display: flex !important; } .mn { display: none !important; } }
        @media(max-width: 900px) {
          .dn { display: none !important; } .mn { display: block !important; }
          .hg, .sg, .fg, .bento { grid-template-columns: 1fr !important; }
          .ho { order: -1; margin-bottom: var(--space-4); }
          .pl0 { padding-left: 0 !important; }
          .bento > div { grid-column: 1 / -1 !important; grid-row: auto !important; }
        }
      `}</style>
    </div>
  );
}
