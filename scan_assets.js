const fs = require('fs');
const https = require('https');
const http = require('http');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.css'));
const urlRegex = /(?:src|href)=["'](https?:\/\/[^"']+)["']|url\(["']?(https?:\/\/[^)"']+)["']?\)/g;
const urls = new Set();
const fileMap = new Map(); // url -> array of files

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
        const url = match[1] || match[2];
        urls.add(url);
        if (!fileMap.has(url)) fileMap.set(url, new Set());
        fileMap.get(url).add(file);
    }
});

console.log(`Found ${urls.size} unique external URLs. Checking status...`);

const promises = Array.from(urls).map(url => {
    return new Promise(resolve => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
            resolve({ url, status: res.statusCode });
            req.abort();
        }).on('error', err => {
            resolve({ url, status: err.message });
        });
        
        // Timeout
        setTimeout(() => {
            req.destroy();
            resolve({ url, status: 'Timeout' });
        }, 5000);
    });
});

Promise.all(promises).then(results => {
    const broken = results.filter(r => typeof r.status !== 'number' || r.status >= 400);
    console.log(`Found ${broken.length} broken assets:`);
    broken.forEach(b => {
        const filesFoundIn = Array.from(fileMap.get(b.url)).join(', ');
        console.log(`- ${b.status} | ${b.url.substring(0, 50)}... | in ${filesFoundIn}`);
    });
});
