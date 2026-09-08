const http = require('http');
const { DatadogFeatureFlagProvider } = require('./lib/feature-flag-provider');
const OpenFeature = require('./lib/openfeature-client');

const provider = new DatadogFeatureFlagProvider({
  environment: 'production',
});

OpenFeature.setProvider(provider);
console.log('Feature flag provider configured, starting server...');

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, 'http://localhost');

  if (parsed.pathname === '/checkout') {
    const userId = parsed.searchParams.get('userId') || 'anonymous';
    const plan = parsed.searchParams.get('plan') || 'free';

    const client = OpenFeature.getClient();
    const context = { targetingKey: userId, userPlan: plan };

    const evaluation = client.getBooleanDetails('new-checkout-flow', false, context);
 

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      userId,
      plan,
      checkoutVersion: evaluation.value ? 'new' : 'old',
    }, null, 2));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
  console.log('Try: curl "http://localhost:3000/checkout?userId=user-42&plan=beta"');
});