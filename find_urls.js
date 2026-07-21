const https = require('https');

const queries = [
    'Lakshadweep snorkeling',
    'Gulmarg ski',
    'Bengal tiger',
    'Hot air balloon',
    'Ladakh motorcycle',
    'Darjeeling sunrise'
];

async function getImageUrl(query) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch=${encodeURIComponent(query)}&pithumbsize=800`;
    return new Promise(resolve => {
        https.get(url, { headers: { 'User-Agent': 'AdrayahBot/1.0 (test@example.com)' } }, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const pages = json.query?.pages;
                    if (pages) {
                        const page = Object.values(pages).find(p => p.thumbnail && p.thumbnail.source);
                        if (page) resolve(page.thumbnail.source);
                        else resolve(null);
                    } else resolve(null);
                } catch(e) { resolve(null); }
            });
        });
    });
}

async function run() {
    for (const q of queries) {
        const url = await getImageUrl(q);
        console.log(q, '->', url);
    }
}
run();
