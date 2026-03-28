import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { registerUser } from '../api/register.js';
import AuthBackground from '../components/AuthBackground';
import { AriaLogo } from '../components/AriaLogo';

export default function RegisterPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Passwords match', pass: password && confirmPassword && password === confirmPassword },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }
    if (!password) { setError('Password is required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    setIsLoading(true);
    
    try {
      const userData = {
        email: email.trim(),
        password,
        firstName: '',
        lastName: ''
      };
      
      await registerUser(userData);
      setSuccess(true);
      setError('');
      
      // Redirect to login or dashboard after successful registration
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('login');
        }
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setSuccess(false);
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
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 300, height: 300, background: 'var(--teal-06)', borderRadius: '50%', filter: 'blur(80px)', zIndex: -1 }}></div>
        
        <div onClick={() => onNavigate('landing')} style={{ cursor: 'pointer', marginBottom: '60px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <AriaLogo height={100} width="auto" />
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 4vw, 64px)', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 24 }}>
          Start <br />
          <span style={{ color: 'var(--teal)' }}>Researching.</span>
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-secondary)', maxWidth: 400, opacity: 0.8, lineHeight: 1.6, marginBottom: 40 }}>
          Create your free account and generate your first AI intelligence report in under 30 seconds.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Full intelligence reports', 'PDF export & history', 'Completely free to start'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--teal-12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
                <Check size={14} />
              </div>
              <span style={{ fontSize: 15, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- RIGHT PANEL (FORM) --- */}
      <div style={{ width: '100%', maxWidth: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          width: '100%', 
          maxWidth: 440, 
          background: 'rgba(14, 17, 23, 0.4)', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid var(--teal-12)', 
          padding: '48px', 
          borderRadius: '24px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
        }}>
          <button onClick={() => onNavigate('landing')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--teal-40)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 32 }}>
            <ArrowLeft size={14} /> Back to Home
          </button>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-primary)', marginBottom: 8 }}>Register</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)', opacity: 0.5, marginBottom: 32 }}>
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Sign in</button>
          </p>

          {error && <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(255, 77, 77, 0.06)', border: '1px solid rgba(255, 77, 77, 0.2)', borderRadius: 8, color: '#FF4D4D', fontSize: 13 }}>{error}</div>}
          {success && <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(15, 207, 188, 0.06)', border: '1px solid rgba(15, 207, 188, 0.2)', borderRadius: 8, color: 'var(--teal)', fontSize: 13 }}>Registration successful! Redirecting...</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
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

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--teal-40)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--teal-40)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--teal-12)'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--teal-25)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--teal-40)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--teal-40)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--teal-12)'}
              />
            </div>

            {password && (
              <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {checks.map(({ label, pass }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: pass ? 'var(--teal-12)' : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={10} style={{ color: pass ? 'var(--teal)' : 'var(--text-secondary)', opacity: pass ? 1 : 0.3 }} />
                    </div>
                    <span style={{ fontSize: 12, color: pass ? 'var(--teal)' : 'var(--text-secondary)', opacity: pass ? 1 : 0.5 }}>{label}</span>
                  </div>
                ))}
              </div>
            )}

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
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
            </button>
          </form>
          
          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)', opacity: 0.5 }}>
            By signing up, you agree to ARIA's Terms of Service.
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

