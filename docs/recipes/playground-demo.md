---
layout: page
---

<script setup>
const demos = {
  basic: `console.log('Hello from Interfacer SDK!');
console.log('');
console.log('Features:');
console.log('  - Keypairoom Authentication');
console.log('  - Resource Management');
console.log('  - Digital Product Passport');
console.log('  - Social & Messaging');
console.log('  - Wallet & Points');
console.log('  - File Hashing');
console.log('');
console.log('Ready to build!');`,

  config: `// Simulate endpoint derivation
const proxyUrl = 'https://proxy.dpp-dev.ddns.dyne.org';

const endpoints = {
  zenflowsUrl: proxyUrl + '/zenflows/api',
  dppUrl: proxyUrl + '/interfacer-dpp',
  inboxSend: proxyUrl + '/inbox/send',
};

console.log('Zenflows:', endpoints.zenflowsUrl);
console.log('DPP:', endpoints.dppUrl);
console.log('Inbox:', endpoints.inboxSend);
console.log('');
console.log('All derived from a single proxyUrl!');`,

  async: `// Async code works
async function fetchData() {
  console.log('Fetching...');
  await new Promise(r => setTimeout(r, 500));
  console.log('Done! Data received.');
}

fetchData().catch(err => console.error(err));`,

  npm: `// WebContainers: import real npm packages!
// (requires COOP/COEP headers — works on docs:serve)
console.log('Checking Node.js version...');
console.log(process.version);
console.log('');

const now = new Date();
console.log('Server time:', now.toISOString());
console.log('Platform:', process.platform);
console.log('');

// You can import any npm package:
// import chalk from 'chalk';
// console.log(chalk.green('Success!'));

console.log('WebContainers is running!');`,
};
</script>

# Playground Demo

Try running these editable code snippets directly in your browser.

## WebContainers

<Playground label="NPM / Node.js" :code="demos.npm" />

*This demo requires WebContainers (COOP/COEP headers). Use `pnpm docs:serve` for full Node.js access. Falls back to sandbox mode otherwise.*

## Basic

<Playground label="Basic" :code="demos.basic" />

## Config

<Playground label="Config" :code="demos.config" />

## Async

<Playground label="Async" :code="demos.async" />
