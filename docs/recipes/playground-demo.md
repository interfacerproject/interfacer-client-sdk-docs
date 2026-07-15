---
layout: page
---

<script setup>
const demos = {
  basic: `console.log('Hello from Interfacer SDK!');

const features = [
  'Keypairoom Authentication',
  'Resource Management',
  'Digital Product Passport',
  'Social & Messaging',
];

console.log('Features:', features.join(', '));
console.log('Ready to build! \\u{1F680}');`,

  config: `// Simulate creating a client config
const config = {
  proxyUrl: 'https://proxy.dpp-dev.ddns.dyne.org',
};

const endpoints = {
  zenflowsUrl: config.proxyUrl + '/zenflows/api',
  dppUrl: config.proxyUrl + '/interfacer-dpp',
  inboxSend: config.proxyUrl + '/inbox/send',
};

console.log('Zenflows:', endpoints.zenflowsUrl);
console.log('DPP:', endpoints.dppUrl);
console.log('Inbox:', endpoints.inboxSend);`,

  async: `// Async code works too
async function fetchData() {
  console.log('Fetching...');
  await new Promise(r => setTimeout(r, 500));
  console.log('Done! Data received.');
}

fetchData().catch(err => console.error(err));
`,
};
</script>

# Playground Demo

Try running these editable code snippets directly in your browser.

## Basic

<Playground label="Basic" :code="demos.basic" />

## Config

<Playground label="Config" :code="demos.config" />

## Async

<Playground label="Async" :code="demos.async" />
