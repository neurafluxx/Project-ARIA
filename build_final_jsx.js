import fs from 'fs';

let html = fs.readFileSync('dashboard-body.html', 'utf-8');

// remove everything from <script> down
html = html.replace(/<script>[\s\S]*/, '');
html = html.replace(/onclick="([^"]*)"/g, 'onClick={() => {}}');
html = html.replace(/class="/g, 'className="');
html = html.replace(/<img([^>]*)>/g, (m, p) => p.endsWith('/') ? m : `<img${p}/>`);
html = html.replace(/<input([^>]*)>/g, (m, p) => p.endsWith('/') ? m : `<input${p}/>`);
html = html.replace(/<br([^>]*)>/g, (m, p) => p.endsWith('/') ? m : `<br${p}/>`);
html = html.replace(/<hr([^>]*)>/g, (m, p) => p.endsWith('/') ? m : `<hr${p}/>`);

// remove HTML comments
html = html.replace(/<!--[\s\S]*?-->/g, '');

// Fix SVG props
html = html.replace(/stroke-width/g, 'strokeWidth');
html = html.replace(/viewBox/g, 'viewBox');
html = html.replace(/fill-rule/g, 'fillRule');
html = html.replace(/clip-rule/g, 'clipRule');

html = html.replace(/style="([^"]*)"/g, (match, p1) => {
    const rules = p1.split(';').filter(Boolean);
    const objStr = rules.map(rule => {
        let parts = rule.split(':');
        let key = parts.shift().trim();
        let val = parts.join(':').trim();
        if(!key) return '';
        key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
        return `${key}: '${val}'`;
    }).filter(Boolean).join(', ');
    return `style={{ ${objStr} }}`;
});

let jsxContent = `
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
        if (isSearching) {
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
    }, [isSearching, loadingStages.length]);

    const handleSearchClick = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        setIsSearching(true);
        setIsSimulating(true); // Trigger new UI skeletons
        setError('');
        
        try {
          const result = await generateReport({ query: query.trim() });
          if (result.success) {
            onSearch(query.trim(), result.report);
            setIsSimulating(false);
            setSelectedReport({
                id: "NEW_REPORT",
                query: query.trim(),
                data: result.report
            });
          } else {
            setError(result.message || 'Failed to generate report.');
            setIsSimulating(false);
          }
        } catch (err) {
          setError(err.message || 'Network error.');
          setIsSimulating(false);
        } finally {
          setIsSearching(false);
        }
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
            overflowX: 'hidden',
            position: 'relative'
        }}>
            {/* Search Top Bar Overlay */}
            <div style={{ position: 'absolute', top: '100px', right: '40px', width: '380px', zIndex: 10 }}>
                <form onSubmit={handleSearchClick} style={{ position: 'relative' }}>
                    <div style={{ padding: '0 12px', background: 'var(--bg-elevated)', border: '1px solid var(--teal-25)', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                        <Search size={18} color="var(--teal)" />
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={typedPlaceholder}
                            disabled={isSearching}
                            style={{ width: '100%', padding: '12px 10px', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}
                        />
                        {!isSearching && (
                            <button type="submit" disabled={!query.trim()} style={{ background: 'var(--teal)', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Generate
                            </button>
                        )}
                    </div>
                </form>
                {isSearching && (
                    <div style={{ marginTop: '10px', color: 'var(--teal)', fontSize: '13px', textAlign: 'right' }}>
                        {loadingStages[loadingStageIdx]}
                    </div>
                )}
            </div>

            {/* User Interface Generated From HTML */}
            ${html.replace(/id="[^"]*"/g, '')}
            
            {/* Detail Overlay */}
            {selectedReport && (
                <div className={"detail-overlay open"} onClick={() => setSelectedReport(null)}></div>
            )}
            
            {/* Detail Panel */}
            <div className={\`detail-panel \${selectedReport ? 'open' : ''}\`}>
                <div className="dp-header">
                    <button className="dp-back" onClick={() => setSelectedReport(null)}>
                        <ChevronRight style={{ transform: 'rotate(180deg)' }} /> Back
                    </button>
                    <div className="dp-header-center">
                        <div className="dp-report-id">REPORT #{selectedReport?.id}</div>
                        <div className="dp-report-query">{selectedReport?.query}</div>
                    </div>
                    <div className="dp-actions">
                        <button className="dp-btn dp-btn-primary">↗ Open Detailed View</button>
                    </div>
                </div>
                <div className="dp-body">
                    {/* Render actual generated report data here */}
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

        </div>
    );
}
`;

// Simple trick to toggle classes for simulating skeleton
jsxContent = jsxContent.replace(/className="sk-wrap hidden"/g, 'className={`sk-wrap ${!isSimulating ? "hidden" : ""}`}');
jsxContent = jsxContent.replace(/className="ct-wrap"/g, 'className={`ct-wrap ${isSimulating ? "hidden" : ""}`}');
jsxContent = jsxContent.replace(/onClick=\{\(\) \=\> \{\}\}/g, ''); // Clear empty clicks
jsxContent = jsxContent.replace(/btn-sim/, 'btn-sim" onClick={toggleSimulate} type="button');

fs.writeFileSync('src/pages/DashboardPage.jsx', jsxContent);
console.log('Done!');
