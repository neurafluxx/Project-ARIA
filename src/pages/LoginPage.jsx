import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { loginUser } from '../api/auth.js';
import AuthBackground from '../components/AuthBackground';
import { AriaLogo } from '../components/AriaLogo';

export default function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) { setError('Email is required'); return; }
    if (!password) { setError('Password is required'); return; }

    setIsLoading(true);
    try {
      await loginUser({ email: email.trim(), password });
      setSuccess(true);
      setTimeout(() => onNavigate('dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    color: 'var(--text-primary)',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--teal-12)',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      <div className="obsidian-grid"></div>
      <AuthBackground />
      
      {/* --- LEFT PANEL (CINEMATIC) --- */}
      <div className="side-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'var(--teal-06)', borderRadius: '50%', filter: 'blur(100px)', zIndex: -1 }}></div>
        
        <div onClick={() => onNavigate('landing')} style={{ cursor: 'pointer', marginBottom: '60px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <AriaLogo height={100} width="auto" />
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 5vw, 84px)', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 24 }}>
          Welcome <br />
          <span style={{ color: 'var(--teal)' }}>Back.</span>
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-secondary)', maxWidth: 400, opacity: 0.7, lineHeight: 1.6 }}>
          Your market intelligence reports are ready for review. Sign in to continue your search.
        </p>
      </div>

      {/* --- RIGHT PANEL (FORM) --- */}
      <div style={{ width: '100%', maxWidth: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          width: '100%', 
          maxWidth: 420, 
          background: 'rgba(14, 17, 23, 0.4)', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid var(--teal-12)', 
          padding: '48px', 
          borderRadius: '24px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
        }}>
          <button onClick={() => onNavigate('landing')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--teal-40)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 32 }}>
            <ArrowLeft size={14} /> Back to Search
          </button>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-primary)', marginBottom: 8 }}>Sign In</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)', opacity: 0.5, marginBottom: 32 }}>
            Enter your credentials to access your dashboard.
          </p>

          {error && <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(255, 77, 77, 0.06)', border: '1px solid rgba(255, 77, 77, 0.2)', borderRadius: 8, color: '#FF4D4D', fontSize: 13 }}>{error}</div>}
          {success && <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(15, 207, 188, 0.06)', border: '1px solid rgba(15, 207, 188, 0.2)', borderRadius: 8, color: 'var(--teal)', fontSize: 13 }}>Login successful. Accessing systems...</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--teal-40)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--teal-40)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--teal-12)'}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--teal-40)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--teal-40)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--teal-12)'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--teal-25)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} style={{ 
              width: '100%', 
              background: 'var(--teal)', 
              color: 'var(--bg-primary)', 
              padding: '16px', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: 16, 
              fontWeight: 600, 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
            </button>
          </form>

          <p style={{ marginTop: 32, textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', opacity: 0.5 }}>
            New to ARIA? {' '}
            <button onClick={() => onNavigate('register')} style={{ background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', fontWeight: 600 }}>Create an account</button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes animate-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: animate-spin 1s linear infinite; }
        @media (max-width: 1024px) {
            .side-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
