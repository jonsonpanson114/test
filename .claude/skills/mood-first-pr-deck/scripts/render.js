// Usage: node render.js <deck.html> <out-dir> [--scale 2] [--pdf out.pdf] [--prefix slide]
// Screenshots every <section class="slide"> (1920x1080) to PNG, and optionally prints one vector PDF (1 page per slide).
const path = require('path');
function loadPlaywright() {
  try { return require('playwright'); } catch (e) {}
  const { execSync } = require('child_process');
  const root = execSync('npm root -g').toString().trim();
  return require(path.join(root, 'playwright'));
}
const { chromium } = loadPlaywright();
const a = process.argv.slice(2);
const html = path.resolve(a[0]), out = a[1];
const opt = (k, d) => { const i = a.indexOf('--' + k); return i > -1 ? a[i + 1] : d; };
const scale = Number(opt('scale', 1)), pdf = opt('pdf'), prefix = opt('prefix', 'slide');
(async () => {
  require('fs').mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  await p.goto('file://' + html);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const ids = await p.$$eval('.slide', els => els.map((e, i) => e.id || (e.id = 's' + (i + 1))));
  for (const [i, id] of ids.entries())
    await p.locator('#' + id).screenshot({ path: path.join(out, `${prefix}_${String(i + 1).padStart(2, '0')}.png`) });
  if (pdf) {
    await p.addStyleTag({ content: '@page{size:1920px 1080px;margin:0} body{background:none} .slide{margin:0;break-after:page}' });
    await p.pdf({ path: pdf, width: '1920px', height: '1080px', printBackground: true });
  }
  await b.close();
  console.log(`${ids.length} slides -> ${out}` + (pdf ? `, pdf -> ${pdf}` : ''));
})();
