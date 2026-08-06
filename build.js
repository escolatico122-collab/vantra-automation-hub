const fs = require('fs');
const path = require('path');

const root = __dirname;
const inputPath = path.join(root, 'index.html');
const outDir = path.join(root, 'dist');
const outputPath = path.join(outDir, 'index.html');

let html = fs.readFileSync(inputPath, 'utf8');

const ids = [
  '1D7JoTU89TM7r37OZJrOWij3EAAOrIjDU',
  '1zw7NHWiALARiH2Rn-wiOj6GPFiXuHk2y',
  '1kTV_mg5gN6UysJXsPS8rp7W8vF54HbpD',
];

for (const id of ids) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`https://drive\\.usercontent\\.google\\.com/download\\?export=download&amp;id=${escapedId}&amp;confirm=t`, 'g'),
    new RegExp(`https://drive\\.usercontent\\.google\\.com/download\\?export=download&id=${escapedId}&confirm=t`, 'g'),
    new RegExp(`https://drive\\.google\\.com/uc\\?export=download&amp;id=${escapedId}`, 'g'),
    new RegExp(`https://drive\\.google\\.com/uc\\?export=download&id=${escapedId}`, 'g'),
  ];
  for (const pattern of patterns) html = html.replace(pattern, `/api/video?id=${id}`);
}

// Always publish the real Vantra branding instead of the old missing PNG path.
html = html.replaceAll('/assets/img/vantra-logo-horizontal.png', '/assets/img/vantra-logo-horizontal.svg?v=3');
html = html.replace(/<link rel="icon"[^>]*>/, '<link rel="icon" href="/favicon.svg?v=3" type="image/svg+xml" />');
html = html.replace(/<link rel="apple-touch-icon"[^>]*>/, '<link rel="apple-touch-icon" href="/favicon.svg?v=3" />');

// Prioritize only the hero video. Portfolio clips load as they approach the viewport.
html = html.replace(/<video([^>]*class="[^"]*auto-video[^"]*"[^>]*)>/g, (match, attrs) => {
  let next = attrs.replace(/\s+preload="[^"]*"/g, '').replace(/\s+fetchpriority="[^"]*"/g, '');
  return `<video${next} preload="auto" fetchpriority="high">`;
});
html = html.replace(/<video([^>]*class="[^"]*(?:portfolio-video|reel-video)[^"]*"[^>]*)>/g, (match, attrs) => {
  let next = attrs.replace(/\s+preload="[^"]*"/g, '');
  return `<video${next} preload="metadata">`;
});

html = html.replace(/Hover to play/g, 'Hover or click to play');
html = html.replace(/label\.textContent='Auto preview'/g, "label.textContent='Tap to play'");
html = html.replace(/label\.textContent=canHover\?'Hover to play':'Tap for sound'/g, "label.textContent=canHover?'Hover or click to play':'Tap to play'");
html = html.replace('.media{position:relative;', '.media{position:relative;cursor:pointer;');

const reliabilityScript = `
<script>
(() => {
  const videos = [...document.querySelectorAll('video')];
  const proxyPrefix = '/api/video?id=';

  function ensureLoaded(video) {
    const source = video.querySelector('source');
    if (source && source.dataset.src && !source.src) {
      source.src = source.dataset.src;
      video.load();
    }
  }

  const lazy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      ensureLoaded(entry.target);
      lazy.unobserve(entry.target);
    });
  }, { rootMargin: '700px 0px' });

  videos.forEach((video, index) => {
    const source = video.querySelector('source');
    if (index > 0 && source && source.getAttribute('src')?.startsWith(proxyPrefix)) {
      source.dataset.src = source.getAttribute('src');
      source.removeAttribute('src');
      lazy.observe(video);
    }

    let retried = false;
    video.addEventListener('error', () => {
      if (retried || !source) return;
      retried = true;
      const id = video.dataset.id || new URL(source.dataset.src || source.src, location.href).searchParams.get('id');
      if (!id) return;
      source.src = 'https://drive.usercontent.google.com/download?export=download&id=' + encodeURIComponent(id) + '&confirm=t';
      video.load();
      if (index === 0) video.play().catch(() => {});
    });
  });

  const hero = videos[0];
  if (hero) {
    ensureLoaded(hero);
    const start = () => hero.play().catch(() => {});
    if (hero.readyState >= 2) start();
    else hero.addEventListener('canplay', start, { once: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden && hero.paused) start(); });
  }
})();
</script>`;

html = html.replace('</body>', reliabilityScript + '\n</body>');
html = html.replace(/content="2026-08-05-[^"]*"/, 'content="2026-08-06-brand-video-v3"');

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, 'assets', 'img'), { recursive: true });
fs.copyFileSync(path.join(root, 'favicon.svg'), path.join(outDir, 'favicon.svg'));
fs.copyFileSync(
  path.join(root, 'assets', 'img', 'vantra-logo-horizontal.svg'),
  path.join(outDir, 'assets', 'img', 'vantra-logo-horizontal.svg')
);
fs.writeFileSync(outputPath, html);
console.log(`Built ${outputPath} with branding and optimized media loading`);
