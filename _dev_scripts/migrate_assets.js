const fs = require('fs');
const https = require('https');
const path = require('path');

// The 18 broken images alt text and their corresponding Stitch screen titles
const manualMap = {
    "Living Root Bridge in Cherrapunji": { title: "Cinematic, high-resolution landscape of the Double Decker Living Root Bridge in Cherrapunji, Meghalaya", slug: "living-root-bridge" },
    "Darjeeling Tea Gardens": { title: "Lush tea gardens in Darjeeling with Kangchenjunga in the background", slug: "darjeeling-tea-gardens" },
    "Kaziranga Rhino": { title: "Image from https://tragamatravels.com/wp-content/uploads/2022/11/Jungle-Safari-3.jpeg", slug: "kaziranga-rhino" },
    "Tawang Monastery": { title: "Majestic Sikkim landscapes, Tsomgo Lake or monasteries against high mountains", slug: "tawang-monastery" },
    "Dawki River": { title: "Cinematic, high-resolution landscape of the Umngot River in Dawki, Meghalaya", slug: "dawki-river" },
    "Konark Sun Temple": { title: "A stunning, high-resolution photograph of the stone chariot at the Vittala Temple complex in Hampi", slug: "konark-sun-temple" },
    "Lush Valleys": { title: "Scenic view of Himachal Pradesh, Spiti Valley or Manali landscapes, lush green valleys and snow-capped peaks", slug: "lush-valleys" },
    "Shimla": { title: "Cinematic, high-resolution landscape of Shimla, Himachal Pradesh. Colonial architecture nestled in green hills with the Mall Road visible", slug: "shimla" },
    "Manali": { title: "Cinematic, high-resolution landscape of Manali, Himachal Pradesh. Lush green valleys, pine forests", slug: "manali" },
    "Rohtang Pass": { title: "Cinematic, high-resolution landscape of Rohtang Pass, Himachal Pradesh. Dramatic mountain pass with snow and clouds", slug: "rohtang-pass" },
    "Kashmir Escape": { title: "A cinematic, high-resolution travel photograph of Dal Lake in Kashmir at dawn, featuring traditional wooden Shikara boats", slug: "kashmir-escape" },
    "Himachal Explorer": { title: "A high-quality travel photo of Himachal Pradesh, showing the vibrant Mussoorie Mall Road", slug: "himachal-explorer" },
    "Kerala Retreat": { title: "A luxury backwater resort in Kerala with infinity pool and traditional architecture", slug: "kerala-retreat" },
    "Rajasthan Royal Circuit": { title: "Professional high-resolution travel photography of the Golden City of Jaisalmer, Rajasthan at sunset", slug: "rajasthan-royal-circuit" },
    "Meghalaya Discovery": { title: "Cinematic, high-resolution landscape of Umiam Lake near Shillong, Meghalaya", slug: "meghalaya-discovery" },
    "Dal Lake Houseboats": { title: "Cinematic, high-resolution landscape of a traditional Shikara boat on Dal Lake, Srinagar, Kashmir at sunset", slug: "dal-lake-houseboats" },
    "Alleppey Backwaters": { title: "Cinematic, high-resolution landscape of Alleppey backwaters, Kerala", slug: "alleppey-backwaters" },
    "Udaipur City Palace": { title: "Cinematic, high-resolution landscape of Udaipur, Rajasthan. The City Palace reflected in Lake Pichola at dusk with golden lights", slug: "udaipur-city-palace" }
};

const allScreens = JSON.parse(fs.readFileSync('all_screens.json', 'utf8'));
const imageCheckResults = JSON.parse(fs.readFileSync('image_check_results.json', 'utf8'));
const brokenImages = imageCheckResults.filter(d => d.status !== 200);

// Create assets directory if not exists
const imagesDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
                return;
            }
            const fileStream = fs.createWriteStream(filepath);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
        }).on('error', reject);
    });
}

async function migrate() {
    let replacements = [];

    for (const broken of brokenImages) {
        const mapEntry = manualMap[broken.alt];
        if (!mapEntry) {
            console.error(`Missing manual mapping for alt: ${broken.alt}`);
            continue;
        }

        // Find the fresh URL in allScreens
        const screen = allScreens.find(s => s.title.includes(mapEntry.title));
        if (!screen) {
            console.error(`Could not find screen with title containing: ${mapEntry.title}`);
            continue;
        }

        const freshUrl = screen.url;
        const ext = freshUrl.includes('.png') ? '.png' : '.jpg';
        const filename = `${mapEntry.slug}${ext}`;
        const filepath = path.join(imagesDir, filename);

        console.log(`Downloading ${filename}...`);
        try {
            await downloadImage(freshUrl, filepath);
            replacements.push({
                oldUrl: broken.url,
                newUrl: `assets/images/${filename}`
            });
            console.log(`Successfully downloaded ${filename}`);
        } catch (e) {
            console.error(`Error downloading ${filename}: ${e.message}`);
        }
    }

    // Now update all HTML files
    console.log('Replacing URLs in HTML files...');
    const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));
    
    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        for (const r of replacements) {
            if (content.includes(r.oldUrl)) {
                // Do a global replace just in case it appears multiple times
                content = content.split(r.oldUrl).join(r.newUrl);
                modified = true;
            }
        }
        
        if (modified) {
            fs.writeFileSync(file, content);
            console.log(`Updated ${file}`);
        }
    }
    
    console.log('Migration complete!');
}

migrate();
