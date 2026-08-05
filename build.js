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

html = html.replace(/content="2026-08-05-[^"]*"/, 'content="2026-08-05-video-proxy-v2"');
html = html.replace(/Hover to play/g, 'Hover or click to play');
html = html.replace(/label\.textContent='Auto preview'/g, "label.textContent='Tap to play'");
html = html.replace(/label\.textContent=canHover\?'Hover to play':'Tap for sound'/g, "label.textContent=canHover?'Hover or click to play':'Tap to play'");

const clickHandler = `
        card.querySelector('.media')?.addEventListener('click', event => {
          if (event.target.closest('.sound-btn')) return;
          stopOthers(card);
          if (video.paused) {
            video.muted = true;
            video.play().then(() => {
              card.classList.add('is-playing');
              if (label) label.textContent = 'Playing preview';
            }).catch(() => {
              if (label) label.textContent = 'Unable to play — refresh';
            });
          } else {
            video.pause();
            card.classList.remove('is-playing');
            if (label) label.textContent = canHover ? 'Hover or click to play' : 'Tap to play';
          }
        });
        video.addEventListener('error', () => {
          if (label) label.textContent = 'Unable to load — refresh';
        });
`;

if (!html.includes("card.querySelector('.media')?.addEventListener('click'")) {
  const marker = "button?.addEventListener('click',";
  const position = html.indexOf(marker);
  if (position !== -1) html = html.slice(0, position) + clickHandler + html.slice(position);
}

html = html.replace('.media{position:relative;', '.media{position:relative;cursor:pointer;');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outputPath, html);
console.log(`Built ${outputPath}`);
