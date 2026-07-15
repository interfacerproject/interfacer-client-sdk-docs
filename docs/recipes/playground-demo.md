---
layout: page
---

<script setup>
const demos = {
  cdn: `// Import the SDK from CDN — works in any browser!
const { InterfacerClient } = await import(
  'https://esm.sh/@dyne/interfacer-client'
);

console.log('SDK loaded:', typeof InterfacerClient);
console.log('');
console.log('Available sub-clients:');
console.log('  client.auth       — Authentication');
console.log('  client.resources  — Projects & Machines');
console.log('  client.files      — File hashing & uploads');
console.log('  client.dpp        — Digital Product Passport');
console.log('  client.inbox      — Messaging');
console.log('  client.wallet     — Idea & Strength points');
console.log('  client.social     — Likes & Follows');
console.log('  client.tagging    — Classification');
console.log('  client.import     — GitHub/GitLab import');
console.log('');
console.log('No install, no Node.js — just the browser!');`,

  config: `// Derive endpoints from a single proxyUrl
const proxyUrl = 'https://proxy.dpp-dev.ddns.dyne.org';

function deriveEndpoints(proxyUrl) {
  const base = proxyUrl.replace(/\\/$/, '');
  return {
    zenflowsUrl: base + '/zenflows/api',
    zenflowsFileUrl: base + '/zenflows/api/file',
    dppUrl: base + '/interfacer-dpp',
    inbox: {
      send: base + '/inbox/send',
      read: base + '/inbox/read',
      countUnread: base + '/inbox/count-unread',
      setRead: base + '/inbox/set-read',
    },
    walletUrl: base + '/wallet/token',
    social: {
      personBase: base + '/inbox/person',
      economicResourceBase: base + '/inbox/economicresource',
    },
  };
}

const endpoints = deriveEndpoints(proxyUrl);
console.log('Zenflows:', endpoints.zenflowsUrl);
console.log('DPP:', endpoints.dppUrl);
console.log('Inbox:', endpoints.inbox.send);
console.log('Wallet:', endpoints.walletUrl);
console.log('');
console.log('All derived from a single proxyUrl!');`,

  tagging: `// Tag classification system — fully client-side
function slugifyTagValue(value) {
  return value
    .normalize('NFKD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const raw = ['3D Printing', 'Open Source Hardware', 'IoT', '  HANDMADE  '];
const tags = raw.map(slugifyTagValue);

console.log('Raw input:', raw);
console.log('Normalized:', tags);
console.log('');
console.log('Tags are client-side only — no API calls needed!');`,
};
</script>

# Playground Demo

Run these examples directly in your browser. Each is editable — modify and re-run to experiment.

## CDN Import

<Playground label="SDK Import" :code="demos.cdn" />

## Endpoint Derivation

<Playground label="Config" :code="demos.config" />

## Tagging

<Playground label="Classification" :code="demos.tagging" />
