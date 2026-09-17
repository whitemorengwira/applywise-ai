// Scratch script to test live production deployment including authenticated cron
async function testLive() {
  const base = 'https://applywise-ai-app.vercel.app';
  console.log('=== TESTING LIVE VERCEL PRODUCTION: ' + base + ' ===');

  const cronUrl = base + '/api/cron/autonomous-cycle?limit=2&dryRun=true';
  const start = Date.now();
  try {
    const res = await fetch(cronUrl, {
      headers: {
        'Authorization': 'Bearer applywise_cron_secure_2026',
        'User-Agent': 'ApplyWise-QC-Auditor/1.0'
      }
    });
    const elapsed = Date.now() - start;
    const text = await res.text();
    console.log(`\n[${res.status}] /api/cron/autonomous-cycle?limit=2&dryRun=true (${elapsed}ms)`);
    try {
      const json = JSON.parse(text);
      console.log(JSON.stringify(json, null, 2));
    } catch {
      console.log(text.slice(0, 500));
    }
  } catch (err) {
    console.error('FAILED cron call:', err.message);
  }
}

testLive();
