import fs from 'fs';

try {
    let html = fs.readFileSync('dashboard-body.html', 'utf-8');

    // remove everything from <script> down
    html = html.replace(/<script>[\s\S]*/, '');
    
    // basic fixes
    html = html.replace(/onclick="([^"]*)"/g, 'onClick={() => {}}');
    html = html.replace(/class="/g, 'className="');
    html = html.replace(/<img(.*?)>/g, (m, p) => p.endsWith('/') ? m : `<img${p}/>`);
    html = html.replace(/<input(.*?)>/g, (m, p) => p.endsWith('/') ? m : `<input${p}/>`);
    html = html.replace(/<br(.*?)>/g, (m, p) => p.endsWith('/') ? m : `<br${p}/>`);
    html = html.replace(/<hr(.*?)>/g, (m, p) => p.endsWith('/') ? m : `<hr${p}/>`);
    html = html.replace(/<!--[\s\S]*?-->/g, ''); // Fix comments

    // SVG
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

    let jsxContent = `import { useState, useEffect } from 'react';
import { Search, LogOut, Activity, ChevronRight } from 'lucide-react';
import { AriaLogo } from '../components/AriaLogo.jsx';
import { logoutUser } from '../api/auth.js';
import { generateReport } from '../api/reports.js';
import '../obsidian-dashboard.css';

export default function DashboardPage({ onNavigate, onSearch }) {
    const [activeTab, setActiveTab] = useState('all');
    const [isSimulating, setIsSimulating] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

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
            <div style={{ position: 'absolute', top: 120, right: 40, width: 400, zIndex: 10 }}>
                <form onSubmit={handleSearchClick} style={{ position: 'relative' }}>
                    <div className={\`search-wrapper \${isSearching ? 'searching' : ''}\`} style={{ padding: '0px 10px', background: 'var(--bg-elevated)', border: '1px solid var(--teal-25)', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
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

            ${html.replace(/id="[^"]*"/g, '')}
            
            {/* Overlay */}
            {selectedReport && (
                <div className="detail-overlay open" onClick={() => setSelectedReport(null)}></div>
            )}
            
            <div className={\`detail-panel \${selectedReport ? 'open' : ''}\`}>
                <div className="dp-header">
                    <button className="dp-back" onClick={() => setSelectedReport(null)}>
                        Back
                    </button>
                    <div className="dp-header-center">
                        <div className="dp-report-id">REPORT #{selectedReport?.id || '001'}</div>
                        <div className="dp-report-query">{selectedReport?.query || 'Loading...'}</div>
                    </div>
                    <div className="dp-actions">
                        <button className="dp-btn dp-btn-primary" onClick={() => onNavigate('report')}>↗ Full Report</button>
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
            
            <style>{\`
               .aria-dashboard .search-wrapper.searching { opacity: 0.5; pointer-events: none; }
            \`}</style>
        </div>
    );
}`;

    // Add state handlers to generated classes
    jsxContent = jsxContent.replace(/className="sk-wrap hidden"/g, 'className={`sk-wrap ${!isSimulating ? "hidden" : ""}`}');
    jsxContent = jsxContent.replace(/className="ct-wrap"/g, 'className={`ct-wrap ${isSimulating ? "hidden" : ""}`}');
    jsxContent = jsxContent.replace(/onClick=\{\(\) => \{\}\}/g, ''); // Clear empty clicks
    jsxContent = jsxContent.replace(/btn-sim/, 'btn-sim" onClick={toggleSimulate} type="button');
    jsxContent = jsxContent.replace(/class="([^"]*)"/g, 'className="$1"');

    fs.writeFileSync('src/pages/DashboardPage.jsx', jsxContent);
    console.log('Conversion completed successfully!');
    process.exit(0);

} catch(e) {
    console.error('Error generating JSX:', e);
    process.exit(1);
}
