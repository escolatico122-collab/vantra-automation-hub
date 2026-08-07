const ALLOWED_IDS = new Set([
  '1D7JoTU89TM7r37OZJrOWij3EAAOrIjDU',
  '1zw7NHWiALARiH2Rn-wiOj6GPFiXuHk2y',
  '1kTV_mg5gN6UysJXsPS8rp7W8vF54HbpD',
  '1nWxpQVMR0EP_K_eVhxkIrdCgh_Kwtyqh',
  '1o6mTIygrFeztPFL8NiV1XABLFcll7LWN',
  '1qrwG1-Cr1FiKKvAcKnAWQoSo2BOutjoE',
]);

export default async function handler(req, res) {
  const id = typeof req.query.id === 'string' ? req.query.id : '';

  if (!ALLOWED_IDS.has(id)) {
    res.status(400).json({ error: 'Invalid video id' });
    return;
  }

  const range = req.headers.range;
  const upstreamUrl = `https://drive.usercontent.google.com/download?export=download&id=${encodeURIComponent(id)}&confirm=t`;

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'video/mp4,video/*;q=0.9,*/*;q=0.8',
    };
    if (range) headers.Range = range;

    const upstream = await fetch(upstreamUrl, {
      headers,
      redirect: 'follow',
    });

    if (!upstream.ok && upstream.status !== 206) {
      res.status(upstream.status).json({ error: 'Unable to load video' });
      return;
    }

    const contentType = upstream.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      res.status(502).json({ error: 'Google Drive returned an HTML confirmation page' });
      return;
    }

    res.status(upstream.status === 206 ? 206 : 200);
    res.setHeader('Content-Type', contentType.startsWith('video/') ? contentType : 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    res.setHeader('Access-Control-Allow-Origin', '*');

    for (const name of ['content-length', 'content-range', 'etag', 'last-modified']) {
      const value = upstream.headers.get(name);
      if (value) res.setHeader(name, value);
    }

    if (!upstream.body) {
      res.end();
      return;
    }

    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (error) {
    console.error('Video proxy failed:', error);
    if (!res.headersSent) res.status(500).json({ error: 'Video proxy failed' });
    else res.end();
  }
}
