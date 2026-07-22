const https = require('https');
const fs = require('fs');
const path = require('path');

const searches = [
    { query: 'Alleppey houseboat', filename: 'alleppey_houseboat_wk.jpg' },
    { query: 'Munnar tea', filename: 'munnar_tea_wk.jpg' },
    { query: 'Umshiang Double-Decker Root Bridge', filename: 'root_bridge_wk.jpg' },
    { query: 'Ranthambore safari', filename: 'ranthambore_safari_wk.jpg' },
    { query: 'Bengal tiger Corbett', filename: 'tiger_wk.jpg' },
    { query: 'Gulmarg ski', filename: 'gulmarg_ski_wk.jpg' },
    { query: 'Ladakh motorcycle', filename: 'ladakh_motorcycle_wk.jpg' },
    { query: 'Jaisalmer desert camp', filename: 'jaisalmer_camp_wk.jpg' }
];

const dest = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

async function fetchImage(search) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch=${encodeURIComponent(search.query)}&pithumbsize=800`;
    
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'AdrayahBot/1.0 (test@example.com)' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const pages = json.query?.pages;
                    if (pages) {
                        const page = Object.values(pages).find(p => p.thumbnail && p.thumbnail.source);
                        if (page) {
                            const imgUrl = page.thumbnail.source;
                            downloadImage(imgUrl, path.join(dest, search.filename), resolve);
                            return;
                        }
                    }
                    console.log('No image found for', search.query);
                    resolve();
                } catch(e) {
                    console.log('Error parsing', search.query, e.message);
                    resolve();
                }
            });
        }).on('error', e => {
            console.log('Request error', search.query, e.message);
            resolve();
        });
    });
}

function downloadImage(url, destPath, cb) {
    https.get(url, { headers: { 'User-Agent': 'AdrayahBot/1.0 (test@example.com)' } }, (res) => {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('Downloaded', path.basename(destPath));
            cb();
        });
    }).on('error', (err) => {
        console.log('Download error', url, err.message);
        fs.unlink(destPath, () => {});
        cb();
    });
}

async function run() {
    for (const search of searches) {
        await fetchImage(search);
    }
}
run();
