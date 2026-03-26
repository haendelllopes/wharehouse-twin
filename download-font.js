const fs = require('fs');
const https = require('https');
fs.mkdirSync('public/fonts', { recursive: true });
const file = fs.createWriteStream('public/fonts/inter.woff');
https.get('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ekwfodd8.woff', response => {
    response.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('Font downloaded successfully.');
    });
}).on('error', err => {
    fs.unlink('public/fonts/inter.woff');
    console.error('Error downloading font:', err.message);
});
