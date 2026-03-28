import { useState, useEffect } from 'react';
import { Search, LogOut, Activity, ChevronRight } from 'lucide-react';
import { AriaLogo } from '../components/AriaLogo.jsx';
import { logoutUser } from '../api/auth.js';
import { generateReport } from '../api/reports.js';
import '../obsidian-dashboard.css';

export default function DashboardPage({ onNavigate, onSearch }) {
    const [activeTab, setActiveTab] = useState('all');
    const [isSimulating, setIsSimulating] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    // Existing Dashboard state
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [typedPlaceholder, setTypedPlaceholder] = useState('');

    useEffect(() => {
        const fullPlaceholder = "e.g. Electric Vehicle market in Europe...";
        let currentIdx = 0;
        const typeInterval = setInterval(() => {
          setTypedPlaceholder(fullPlaceholder.slice(0, currentIdx));
          currentIdx++;
          if (currentIdx > fullPlaceholder.length) clearInterval(typeInterval);
        }, 50);
        return () => clearInterval(typeInterval);
    }, []);

    const loadingStages = [
        "Analyzing market parameters...",
        "Gathering intelligence...",
        "Synthesizing insights...",
        "Formatting final report..."
    ];
    const [loadingStageIdx, setLoadingStageIdx] = useState(0);

    useEffect(() => {
        let interval;
        if (isSearching || isSimulating) {
          interval = setInterval(() => {
            setLoadingStageIdx(prev => {
              if (prev < loadingStages.length - 1) return prev + 1;
              clearInterval(interval);
              return prev;
            });
          }, 1500);
        } else {
          setLoadingStageIdx(0);
        }
        return () => clearInterval(interval);
    }, [isSearching, isSimulating, loadingStages.length]);

    const handleSearchClick = async (e) => {
        if(e) e.preventDefault();
        if (!query.trim()) return;
        setIsSearching(true);
        setIsSimulating(true);
        setError('');
        try {
          const result = await generateReport({ query: query.trim() });
          if (result.success) {
            onSearch(query.trim(), result.report);
            setSelectedReport({
                id: "NEW_RPT",
                query: query.trim(),
                data: result.report
            });
          } else {
            setError(result.message || 'Failed to generate report.');
          }
        } catch (err) {
          setError(err.message || 'Network error.');
        } finally {
          setIsSearching(false);
          setIsSimulating(false);
        }
    };

    const toggleSimulate = () => {
        setIsSimulating(!isSimulating);
    };

    const handleLogout = async () => {
        try {
          await logoutUser();
        } catch(err) {} finally {
          onNavigate('login');
        }
    };

    return (
        <div className="aria-dashboard" style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            overflowX: 'hidden'
        }}>
            <header className="header">
                <div className="logo" onClick={() => onNavigate('landing')} style={{ cursor: 'pointer' }}>
                   <AriaLogo height={36} width="auto" />
                </div>
                <div className="header-right">
                    <div className="live-pill"><div className="live-pip"></div>Live</div>
                    <button className="btn-sim" onClick={handleLogout}>Log Out</button>
                    <button className="btn-sim" onClick={toggleSimulate}>▶ Simulate Info</button>
                </div>
            </header>

            <div style={{ position: 'absolute', top: 120, right: 40, width: 400, zIndex: 10 }}>
                <form onSubmit={handleSearchClick} style={{ position: 'relative' }}>
                    <div className={`search-wrapper ${isSearching ? 'searching' : ''}`} style={{ padding: '0px 10px', background: 'var(--bg-elevated)', border: '1px solid var(--teal-25)', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                        <Search size={18} color="var(--teal)" />
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={typedPlaceholder}
                            disabled={isSearching || isSimulating}
                            style={{ width: '100%', padding: '12px 10px', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}
                        />
                        {!(isSearching || isSimulating) && (
                            <button type="submit" disabled={!query.trim()} style={{ background: 'var(--teal)', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Generate
                            </button>
                        )}
                    </div>
                </form>
                {(isSearching || isSimulating) && (
                    <div style={{ marginTop: 10, color: 'var(--teal)', fontSize: '13px', textAlign: 'right' }}>
                        {loadingStages[loadingStageIdx]}
                    </div>
                )}
                {error && (
                    <div style={{ marginTop: 10, color: '#ff4a4a', fontSize: '13px', textAlign: 'right' }}>
                        {error}
                    </div>
                )}
            </div>

            <div className="wrap">
                <div className="page-head">
                    <div className="page-eyebrow">Intelligence Platform</div>
                    <h1>AI Report <em>Dashboard</em></h1>
                    <p>Powered by Nabeel Vision · CEO: Abdullah Nadeem</p>
                </div>

                <div className="tabs">
                    <button className={`tab ${activeTab === 'all' ? 'on' : ''}`} onClick={() => setActiveTab('all')}>All</button>
                    <button className={`tab ${activeTab === 'market' ? 'on' : ''}`} onClick={() => setActiveTab('market')}>Market</button>
                    <button className={`tab ${activeTab === 'competitor' ? 'on' : ''}`} onClick={() => setActiveTab('competitor')}>Competitors</button>
                    <button className={`tab ${activeTab === 'history' ? 'on' : ''}`} onClick={() => setActiveTab('history')}>History</button>
                </div>

                {/* SKeloton Overlay logic */}
                
                {(activeTab === 'all' || activeTab === 'market') && (
                    <div className="card">
                        <div className="card-head">
                            <div className="card-head-left">
                                <div className="icon-wrap">📊</div>
                                <div><div className="card-title">Market Analysis</div><div className="card-sub">ARIA Intelligence</div></div>
                            </div>
                        </div>
                        <div className={`sk-wrap ${!isSimulating ? 'hidden' : ''}`}>
                             <div style={{ padding: '0 24px 24px' }}>Loading market overview...</div>
                        </div>
                        <div className={`ct-wrap ${isSimulating ? 'hidden' : ''}`}>
                            <div className="stat-grid">
                                <div className="stat-tile"><div className="stat-lbl">Market Size</div><div className="stat-val"><span>💰</span>{selectedReport?.data?.market?.market_size || '$142B'}</div></div>
                                <div className="stat-tile"><div className="stat-lbl">Growth Rate</div><div className="stat-val"><span>📈</span>{selectedReport?.data?.market?.growth_trends?.[0] || '+34% YoY'}</div></div>
                                <div className="stat-tile"><div className="stat-lbl">Stage</div><div className="stat-val"><span>🎯</span>Growth</div></div>
                            </div>
                            <div className="info"><div className="info-lbl">Overview</div><p>{selectedReport?.data?.market?.key_insight || 'The AI SaaS market is experiencing exponential growth driven by enterprise adoption.'}</p></div>
                        </div>
                    </div>
                )}

                {(activeTab === 'all' || activeTab === 'competitor') && (
                    <div className="card">
                        <div className="card-head">
                            <div className="card-head-left">
                                <div className="icon-wrap">⚔️</div>
                                <div><div className="card-title">Competitor Analysis</div><div className="card-sub">Competitive Landscape</div></div>
                            </div>
                        </div>
                        <div className={`sk-wrap ${!isSimulating ? 'hidden' : ''}`}>
                             <div style={{ padding: '0 24px 24px' }}>Analyzing competitors...</div>
                        </div>
                        <div className={`ct-wrap ${isSimulating ? 'hidden' : ''}`}>
                             <div className="comp-grid">
                                {(selectedReport?.data?.competitors?.competitors || [{ name: 'Competitor A', strength: 'Market leader' }]).map((comp, idx) => (
                                    <div className="comp-card" key={idx}>
                                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                          <div className="comp-name" style={{ fontSize: '18px', fontWeight: 'bold' }}>{comp.name}</div>
                                       </div>
                                       <div><div className="comp-sec-lbl lbl-g">▲ Strengths</div><div className="tags"><span className="tag tg-green">{comp.strength}</span></div></div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                )}

            </div>
            
            {/* Detail Overlay */}
            {selectedReport && (
                <div className="detail-overlay open" onClick={() => setSelectedReport(null)}></div>
            )}
            
            <div className={`detail-panel ${selectedReport ? 'open' : ''}`}>
                <div className="dp-header">
                    <button className="dp-back" onClick={() => setSelectedReport(null)}>
                        Back
                    </button>
                    <div className="dp-header-center">
                        <div className="dp-report-id">REPORT #{selectedReport?.id || '001'}</div>
                        <div className="dp-report-query">{selectedReport?.query || 'Loading...'}</div>
                    </div>
                    <div className="dp-actions">
                        <button className="dp-btn dp-btn-primary" onClick={() => { setSelectedReport(null); onNavigate('report'); }}>↗ Full Report View</button>
                    </div>
                </div>
                <div className="dp-body">
                    {selectedReport?.data && (
                        <div style={{ padding: '24px' }}>
                            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--teal)' }}>Executive Summary</h2>
                            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{selectedReport.data.market_size_and_growth}</p>
                            
                            <h2 style={{ fontSize: '24px', marginTop: '32px', marginBottom: '16px', color: 'var(--teal)' }}>Competitive Landscape</h2>
                            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{selectedReport.data.competitor_landscape}</p>
                            
                            <h2 style={{ fontSize: '24px', marginTop: '32px', marginBottom: '16px', color: 'var(--teal)' }}>Target Audience</h2>
                            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{selectedReport.data.target_audience}</p>
                        </div>
                    )}
                </div>
            </div>
            
            <style>{`
               .aria-dashboard .search-wrapper.searching { opacity: 0.5; pointer-events: none; }
            `}</style>
        </div>
    );
}
