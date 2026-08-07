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

html = html.replaceAll('/assets/img/vantra-logo-horizontal.png', '/assets/img/vantra-logo-horizontal.svg?v=5');
html = html.replace(/<link rel="icon"[^>]*>/, '<link rel="icon" href="/favicon.svg?v=5" type="image/svg+xml" />');
html = html.replace(/<link rel="apple-touch-icon"[^>]*>/, '<link rel="apple-touch-icon" href="/favicon.svg?v=5" />');

for (const [oldId, newId] of videoMap) {
  html = html.replaceAll(oldId, newId);
}

html = html.replace(/<source src="(?:https:\/\/drive\.usercontent\.google\.com\/download\?[^\"]*id=|\/api\/video\?id=)([^\"&]+)[^\"]*" type="video\/mp4">/g,
  (_match, id) => `<source src="/api/video?id=${id}" type="video/mp4">`);

html = html.replace(/<video([^>]*)>/g, (match, attrs) => {
  let next = attrs
    .replace(/\s+preload="[^"]*"/g, '')
    .replace(/\s+fetchpriority="[^"]*"/g, '')
    .replace(/\s+autoplay/g, '')
    .replace(/\s+controls/g, '');

  if (/class="[^"]*auto-video/.test(next)) {
    return `<video${next} preload="auto" fetchpriority="high" autoplay muted loop playsinline>`;
  }

  return `<video${next} preload="metadata" muted loop playsinline>`;
});

const reliabilityScript = `
<script>
(() => {
  const videos = [...document.querySelectorAll('video')];
  const cards = [...document.querySelectorAll('.reel')];

  function safePlay(video) {
    if (!video) return;
    video.muted = true;
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }

  function reset(video) {
    if (!video) return;
    video.pause();
    try { video.currentTime = 0; } catch (_) {}
  }

  videos.forEach((video, index) => {
    video.setAttribute('playsinline', '');
    video.muted = true;

    if (index === 0) {
      const startHero = () => safePlay(video);
      if (video.readyState >= 2) startHero();
      else video.addEventListener('canplay', startHero, { once: true });
    }

    video.addEventListener('click', () => {
      if (video.paused) safePlay(video);
      else video.pause();
    });
  });

  cards.forEach((card) => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => safePlay(video));
    card.addEventListener('mouseleave', () => reset(video));
    card.addEventListener('focusin', () => safePlay(video));
    card.addEventListener('focusout', () => reset(video));
    card.addEventListener('click', (event) => {
      if (event.target.closest('button,a')) return;
      if (video.paused) safePlay(video);
      else video.pause();
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target.querySelector('video');
      if (!video || window.matchMedia('(hover:hover)').matches) return;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.7) safePlay(video);
      else reset(video);
    });
  }, { threshold: [0, .7, 1] });

  cards.forEach(card => observer.observe(card));

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    const hero = videos[0];
    if (hero && hero.paused) safePlay(hero);
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
console.log(`Built ${outputPath} with proxied optimized videos and hover/click playback`);
