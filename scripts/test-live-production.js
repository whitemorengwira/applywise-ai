// Scratch script to test live production deployment
async function testLive() {
  const base = 'https://applywise-ai-app.vercel.app';
  const endpoints = [
    '/api/health',
    '/api/ready',
    '/api/metrics',
    '/api/cv-integrity',
    '/api/cron/autonomous-cycle?limit=2&dryRun=true'
  ];

  console.log('=== TESTING LIVE VERCEL PRODUCTION: ' + base + ' ===');

  for (const ep of endpoints) {
    const url = base + ep;
    const start = Date.now();
    try {
      const res = await fetch(url);
      const elapsed = Date.now() - start;
      const text = await res.text();
      console.log(`\n[${res.status}] ${ep} (${elapsed}ms)`);
      if (text.startsWith('{') || text.startsWith('[')) {
        try {
          const json = JSON.parse(text);
          console.log(JSON.stringify(json, null, 2).slice(0, 500));
        } catch {
          console.log(text.slice(0, 300));
        }
      } else {
        console.log(`Body size: ${text.length} bytes (starts with: ${text.slice(0, 100).trim()}...)`);
      }
    } catch (err) {
      console.error(`FAILED ${ep}:`, err.message);
    }
  }
}

testLive();
