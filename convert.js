const fs = require('fs');
let html = fs.readFileSync('dashboard-body.html', 'utf-8');

// remove script and overlay
html = html.replace(/<script>[\s\S]*?<\/script>/g, '');

// class to className
html = html.replace(/class=/g, 'className=');

// onclick to onClick
html = html.replace(/onclick=/g, 'onClick=');

// Fix self-closing tags
html = html.replace(/<img([^>]*)>/g, (m, p) => p.endsWith('/') ? m : `<img${p}/>`);
html = html.replace(/<input([^>]*)>/g, (m, p) => p.endsWith('/') ? m : `<input${p}/>`);

// fix styles
html = html.replace(/style=\"([^\"\\]*)\"/g, (m, p1) => {
    let styles = p1.split(';').filter(s => s.trim().length > 0);
    let objArr = styles.map(s => {
        let parts = s.split(':');
        let key = parts.shift().trim();
        let val = parts.join(':').trim();
        
        // camelCase key
        key = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        
        return `${key}: '${val}'`;
    });
    return `style={{ ${objArr.join(', ')} }}`;
});

// Some comments
html = html.replace(/<!--[\s\S]*?-->/g, '');

fs.writeFileSync('dashboard_jsx.txt', html);
console.log('Conversion successful');
