const https = require('https');
const fs = require('fs');
const path = require('path');

const items = [
    { name: 'Star Shine Diamond Ring', url: 'https://www.candere.com/star-shine-diamond-ring.html' },
    { name: 'Mandira Diamond Wedding Band', url: 'https://www.candere.com/mandira-diamond-wedding-band.html' },
    { name: 'Flamingos Diamond Earrings', url: 'https://www.candere.com/flamingos-diamond-earrings.html' },
    { name: 'William Diamond Ring', url: 'https://www.candere.com/william-diamond-ring.html' },
    { name: 'Wonderous Leaves Changeable Diamond Earrings', url: 'https://www.candere.com/wonderous-leaves-changeable-diamond-earrings.html' },
    { name: 'Savina Diamond Earrings', url: 'https://www.candere.com/savina-diamond-earrings.html' },
    { name: 'Echo Diamond Earrings', url: 'https://www.candere.com/echo-diamond-earrings.html' },
    { name: 'Esteri Diamond Earrings', url: 'https://www.candere.com/esteri-diamond-earrings.html' }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else {
                res.resume();
                resolve(null);
            }
        }).on('error', reject);
    });
};

const run = async () => {
    const publicDir = path.join(__dirname, 'public', 'images');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    // Try fetching images for each item
    for (const item of items) {
        console.log(`Fetching ${item.name}...`);
        try {
            const data = await new Promise((resolve, reject) => {
                https.get(item.url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                }, (res) => {
                    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                        // follow redirect once
                        const loc = res.headers.location.startsWith('http') ? res.headers.location : 'https://www.candere.com' + res.headers.location;
                        https.get(loc, {
                            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                        }, (res2) => {
                            let body = '';
                            res2.on('data', chunk => body += chunk);
                            res2.on('end', () => resolve(body));
                        }).on('error', reject);
                    } else {
                        let body = '';
                        res.on('data', chunk => body += chunk);
                        res.on('end', () => resolve(body));
                    }
                }).on('error', reject);
            });
            
            const match = data.match(/https:\/\/www\.candere\.com\/media\/catalog\/product\/[^"'\s]+\.(jpg|jpeg|png|webp)/i);
            if (match && match[0]) {
                const imgUrl = match[0];
                const ext = path.extname(imgUrl).split('?')[0];
                const filename = item.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + ext;
                const filepath = path.join(publicDir, filename);
                console.log(`Downloading ${imgUrl} to ${filename}`);
                await downloadImage(imgUrl, filepath);
            } else {
                console.log(`No image found for ${item.name}`);
            }
        } catch (err) {
            console.error(`Failed to fetch ${item.name}: ${err.message}`);
        }
    }
    
    // Also fetch the logo
    console.log("Fetching logo...");
    try {
        await downloadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Kalyan_Jewellers_logo.svg/512px-Kalyan_Jewellers_logo.svg.png', path.join(publicDir, 'logo.png'));
        console.log("Logo fetched.");
    } catch(e) {
        console.log("Could not fetch logo.");
    }
};

run();
