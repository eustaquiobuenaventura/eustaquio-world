const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set viewport to a standard desktop size
    await page.setViewport({ width: 1280, height: 800 });
    
    // Load the local file
    const filePath = 'file://' + path.resolve(__dirname, 'index.html');
    await page.goto(filePath, { waitUntil: 'networkidle0' });

    // Take the screenshot
    const screenshotPath = path.join(__dirname, 'screenshot.png');
    await page.screenshot({ path: screenshotPath });

    console.log('SUCCESS:' + screenshotPath);
    await browser.close();
  } catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
  }
})();
