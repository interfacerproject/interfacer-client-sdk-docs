---
layout: page
---

<script setup>
const configDemo = `// Simulate InterfacerClient configuration
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
console.log('✓ Zenflows:', endpoints.zenflowsUrl);
console.log('✓ DPP:', endpoints.dppUrl);
console.log('✓ Inbox send:', endpoints.inbox.send);
console.log('✓ Wallet:', endpoints.walletUrl);
console.log('\\nAll endpoints derived from a single proxyUrl!');`;

const subClientsDemo = `// List all available sub-clients (lazily initialized)
const subClients = [
  'auth', 'graphql', 'resources', 'files', 'dpp',
  'inbox', 'wallet', 'social', 'tagging', 'import',
];

console.log('Available sub-clients:');
subClients.forEach(function(name) {
  console.log('  client.' + name);
});

console.log('\\nAll accessed via: client.<name>');
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
