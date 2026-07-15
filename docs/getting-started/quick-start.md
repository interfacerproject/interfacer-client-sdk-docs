---
layout: page
---

<script setup>
const configDemo = `// Import the SDK from CDN
const { InterfacerClient, createConfig, deriveEndpointsFromProxy } = await import(
  'https://esm.sh/@dyne/interfacer-client'
);

const proxyUrl = 'https://proxy.dpp-dev.ddns.dyne.org';
const endpoints = deriveEndpointsFromProxy(proxyUrl);

console.log('Proxy:', proxyUrl);
console.log('');
console.log('Zenflows:', endpoints.zenflowsUrl);
console.log('DPP:', endpoints.dppUrl);
console.log('Inbox:', endpoints.inbox.send);
console.log('Wallet:', endpoints.walletUrl);
console.log('');
console.log('All derived from a single proxyUrl!');`;

const subClientsDemo = `// All sub-clients are lazily initialized
const subClients = [
  'auth', 'graphql', 'resources', 'files', 'dpp',
  'inbox', 'wallet', 'social', 'tagging', 'import',
];

console.log('Available sub-clients:');
subClients.forEach(function(name) {
  console.log('  client.' + name);
});
console.log('');
console.log('Accessed via: client.<name>');
console.log('Lazy-initialized on first access');`;
</script>

# Quick Start

Create a client and check your authentication status in under a minute.

## 1. Configure

The simplest configuration uses a `proxyUrl` — all service endpoints are derived automatically:

```ts
import { InterfacerClient } from "@dyne/interfacer-client";

const client = new InterfacerClient({
  proxyUrl: "https://proxy.dpp-dev.ddns.dyne.org",
});
```

<Playground label="Endpoint Derivation" :code="configDemo" />

You can also specify each endpoint explicitly for full control.

## 2. Access Sub-Clients

All sub-clients are lazily initialized:

<Playground label="Sub-Clients" :code="subClientsDemo" />

## Next Steps

- [Authenticate](/getting-started/authentication) — full Keypairoom auth flow
- [Client Guide](/guides/client) — deep dive into the facade architecture
- [Recipes](/recipes/authenticate) — task-oriented walkthroughs
