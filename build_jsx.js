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

// Fix SVG props
html = html.replace(/stroke-width/g, 'strokeWidth');
html = html.replace(/viewBox/g, 'viewBox');
html = html.replace(/fillRule/g, 'fillRule');
html = html.replace(/clipRule/g, 'clipRule');

html = html.replace(/style="([^"]*)"/g, (match, p1) => {
    const rules = p1.split(';').filter(Boolean);
    const objStr = rules.map(rule => {
        let [key, ...vals] = rule.split(':');
        let val = vals.join(':').trim();
        if(!key) return '';
        key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
        return `${key}: '${val}'`;
    }).filter(Boolean).join(', ');
    return `style={{ ${objStr} }}`;
});

let jsxContent = `
import React, { useState } from 'react';
import '../obsidian-dashboard.css';

export default function DashboardPage({ onNavigate, onSearch }) {
    const [activeTab, setActiveTab] = useState('all');
    const [isSimulating, setIsSimulating] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    const reports = []; // You can add the report data here

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
    };

    const toggleSimulate = () => {
        setIsSimulating(!isSimulating);
    };

    return (
        <div className="aria-dashboard">
            ${html}
        </div>
    );
}
`;

fs.writeFileSync('src/pages/DashboardPage1.jsx', jsxContent);
