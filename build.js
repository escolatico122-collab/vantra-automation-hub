const fs = require('fs');
const path = require('path');

const root = __dirname;
const inputPath = path.join(root, 'index.html');
const outDir = path.join(root, 'dist');
const outputPath = path.join(outDir, 'index.html');

let html = fs.readFileSync(inputPath, 'utf8');

const videoMap = [
  ['1D7JoTU89TM7r37OZJrOWij3EAAOrIjDU', '1nWxpQVMR0EP_K_eVhxkIrdCgh_Kwtyqh'],
  ['1zw7NHWiALARiH2Rn-wiOj6GPFiXuHk2y', '1o6mTIygrFeztPFL8NiV1XABLFcll7LWN'],
  ['1kTV_mg5gN6UysJXsPS8rp7W8vF54HbpD', '1qrwG1-Cr1FiKKvAcKnAWQoSo2BOutjoE'],
];

// Keep branding self-contained and published with the build.
html = html.replaceAll('/assets/img/vantra-logo-horizontal.png', '/assets/img/vantra-logo-horizontal.svg?v=4');
html = html.replace(/<link rel="icon"[^>]*>/, '<link rel="icon" href="/favicon.svg?v=4" type="image/svg+xml" />');
html = html.replace(/<link rel="apple-touch-icon"[^>]*>/, '<link rel="apple-touch-icon" href="/favicon.svg?v=4" />');

// Replace only the three video asset IDs with their optimized public versions.
for (const [oldId, newId] of videoMap) {
  html = html.replaceAll(oldId, newId);
  const escapedNewId = newId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const direct = `https://drive.usercontent.google.com/download?export=download&id=${newId}&confirm=t`;
  html = html.replace(new RegExp(`/api/video\\?id=${escapedNewId}`, 'g'), direct);
  html = html.replace(
    new RegExp(`https://drive\\.usercontent\\.google\\.com/download\\?export=download(?:&amp;|&)id=${escapedNewId}(?:&amp;|&)confirm=t`, 'g'),
    direct
  );
}

html = html.replace(/<video([^>]*)>/g, (match, attrs) => {
  let next = attrs
    .replace(/\s+preload="[^"]*"/g, '')
    .replace(/\s+fetchpriority="[^"]*"/g, '');

  if (/class="[^"]*auto-video/.test(next)) {
    return `<video${next} preload="auto" fetchpriority="high" autoplay muted loop playsinline>`;
  }

  return `<video${next} preload="metadata" muted loop playsinline>`;
});

const reliabilityScript = `
<script>
(() => {
  const videos = [...document.querySelectorAll('video')];

  videos.forEach((video, index) => {
    const source = video.querySelector('source');
    if (!source) return;

    const tryPlay = () => video.play().catch(() => {});
    if (index === 0) {
      if (video.readyState >= 2) tryPlay();
      else video.addEventListener('canplay', tryPlay, { once: true });
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    const hero = videos[0];
    if (hero && hero.paused) hero.play().catch(() => {});
  });
})();
</script>`;

html = html.replace('</body>', reliabilityScript + '\n</body>');

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, 'assets', 'img'), { recursive: true });
fs.copyFileSync(path.join(root, 'favicon.svg'), path.join(outDir, 'favicon.svg'));
fs.copyFileSync(
  path.join(root, 'assets', 'img', 'vantra-logo-horizontal.svg'),
  path.join(outDir, 'assets', 'img', 'vantra-logo-horizontal.svg')
);
fs.writeFileSync(outputPath, html);
console.log(`Built ${outputPath} with optimized public videos and intact branding`);
