const https = require('https');

const BASE_URL = 'https://applywise-ai-app.vercel.app';

function sendChatMessage(message, modelOverride) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      message,
      modelOverride,
    });

    const options = {
      hostname: 'applywise-ai-app.vercel.app',
      port: 443,
      path: '/api/control/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (err) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function runLiveAcceptanceTests() {
  console.log('===============================================================');
  console.log('APPLYWISE AI — PRODUCTION LIVE ACCEPTANCE TEST SUITE');
  console.log('Target URL:', BASE_URL);
  console.log('Date:', new Date().toISOString());
  console.log('===============================================================\n');

  const tests = [
    { id: 1, prompt: 'hi', desc: 'Greeting / conversational control' },
    { id: 2, prompt: 'What is my master CV SHA-256 hash?', desc: 'Master CV immutability verification' },
    { id: 3, prompt: 'What AI model is actually answering me right now?', desc: 'Truthful runtime & model state inspection' },
    { id: 4, prompt: 'What do you know about my professional background?', desc: 'RAG candidate background retrieval' },
    { id: 5, prompt: 'What do you know about N.White Systems?', desc: 'RAG company / website retrieval' },
    { id: 6, prompt: 'Find current eligible AI jobs for me in South Africa.', desc: 'Job search & SA eligibility' },
    { id: 7, prompt: 'Prepare an application for the selected job.', desc: 'LangGraph application preparation pipeline' },
    { id: 8, prompt: 'What happened during the last autonomous cycle?', desc: 'Autonomous cycle / scheduler state' },
    { id: 9, prompt: 'Is my AI observability working?', desc: 'Prometheus / Grafana telemetry status' },
    { id: 10, prompt: 'Why is the currently selected model unavailable?', desc: 'Upstream provider diagnostic report' },
    { id: 11, prompt: 'What is my career strategy?', desc: 'Section 15 Provider Failure Test' },
  ];

  const results = [];

  for (const t of tests) {
    console.log(`>>> Executing Test ${t.id}: "${t.prompt}" (${t.desc})...`);
    try {
      const response = await sendChatMessage(t.prompt);
      const b = response.body || {};
      const meta = b.metadata || {};
      const content = b.message || b.content || '';
      console.log(`    HTTP Status: ${response.status}`);
      console.log(`    Provider: ${b.provider || meta.provider || 'N/A'}`);
      console.log(`    Model: ${b.model || b.activeModel || meta.model || 'N/A'}`);
      console.log(`    Runtime: ${b.runtime || b.runtimeStatus || meta.runtime || 'N/A'}`);
      console.log(`    Tools Used: ${(b.toolCalls || []).join(', ') || 'none'}`);
      console.log(`    Fallback: ${b.fallback !== undefined ? b.fallback : meta.fallback}`);
      console.log(`    Latency: ${b.latencyMs !== undefined ? b.latencyMs : meta.latencyMs}ms`);
      console.log(`    Response Content:`);
      const preview = content.split('\n').map((l) => '      | ' + l).join('\n');
      console.log(preview);
      console.log('---------------------------------------------------------------\n');
      results.push({ test: t, response, body: b });
    } catch (e) {
      console.error(`    FAILED with exception:`, e.message);
      results.push({ test: t, error: e.message });
    }
  }

  // Model Switcher Verification Test:
  console.log('>>> Executing Model Switcher Test with override: nemotron-3.5-lightning-free...');
  const switchRes = await sendChatMessage('What AI model is actually answering me right now?', 'nemotron-3.5-lightning-free');
  const sb = switchRes.body || {};
  console.log(`    Model Switcher Response Model: ${sb.model || sb.activeModel || sb.metadata?.model}`);
  console.log(`    Model Switcher Response Runtime: ${sb.runtime || sb.runtimeStatus || sb.metadata?.runtime}`);
  console.log(`    Model Switcher Response Provider: ${sb.provider || sb.metadata?.provider}`);
  console.log('===============================================================\n');
}

runLiveAcceptanceTests().catch(console.error);
