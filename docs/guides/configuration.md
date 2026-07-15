---
layout: page
---

<script setup>
const proxyDemo = `import { InterfacerClient, createConfig, deriveEndpointsFromProxy } from '@dyne/interfacer-client';

// One-line config — everything derived
const config = createConfig({
  proxyUrl: 'https://proxy.dpp-dev.ddns.dyne.org',
});

const client = new InterfacerClient(config);

console.log('Derived endpoints:');
console.log('  Zenflows:   ', config.zenflowsUrl);
console.log('  Zenflows FS:', config.zenflowsFileUrl);
console.log('  DPP:        ', config.dppUrl);
console.log('  Inbox send: ', config.inbox.send);
console.log('  Inbox read: ', config.inbox.read);
console.log('  Inbox count:', config.inbox.countUnread);
console.log('  Inbox set:  ', config.inbox.setRead);
console.log('  Wallet:     ', config.walletUrl);
console.log('  Social pers:', config.social.personBase);
console.log('  Social ER:  ', config.social.economicResourceBase);
console.log('  OSH:        ', config.oshUrl);`;

const explicitDemo = `import { InterfacerClient, createConfig } from '@dyne/interfacer-client';

// Explicit config — full control over every endpoint
const config = createConfig({
  proxyUrl: 'https://proxy.dpp-dev.ddns.dyne.org',
  // Override any derived URL:
  dppUrl: 'https://custom-dpp.example.com/api',
  walletUrl: 'https://wallet.example.com/v2/token',
  // Add fields not derivable from proxyUrl:
  zenflowsAdmin: process.env.ZENFLOWS_ADMIN_TOKEN,
  specs: {
    machine: '01JMKY...',
    dpp: '01JNKZ...',
  },
});

// proxyUrl-derivable URLs use proxyUrl;
// dppUrl and walletUrl use the explicit overrides
const client = new InterfacerClient(config);`;

const storageDemo = `import { createMemoryStorage, createConfig, InterfacerClient } from '@dyne/interfacer-client';

// In-memory storage (keys lost on page reload)
const memoryStore = createMemoryStorage();

const client = new InterfacerClient(
  createConfig({ proxyUrl: 'https://proxy.dpp-dev.ddns.dyne.org' }),
  memoryStore  // ← inject custom storage
);

// Verify it works — set and read a key
client.store.setItem('test-key', 'hello');
console.log('Stored:', client.store.getItem('test-key'));

// The SDK uses this store for all auth keys:
//   eddsaPrivateKey, eddsaPublicKey, seed,
//   ethereumAddress, reflowPublicKey, ecdhPublicKey,
//   bitcoinPublicKey, authId, authEmail, etc.`;

const localsDemo = `import { createMemoryStorage } from '@dyne/interfacer-client';

// Implement KeyStorage using localStorage
const store = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};

// Now inject it when creating the client:
// const client = new InterfacerClient(config, store);

console.log('Custom localStorage adapter ready');`;

const instanceDemo = `import { getInstanceVariables, clearInstanceVariablesCache } from '@dyne/interfacer-client';

// getInstanceVariables fetches ResourceSpecification IDs
// from the Zenflows GraphQL endpoint. These are used internally
// by createProject, createMachine, and createDppResource.

// The result is cached. Clear the cache when switching servers:
// clearInstanceVariablesCache();

console.log('Instance variables are fetched and cached automatically.');
console.log('Use clearInstanceVariablesCache() when changing servers.');`;
</script>

# Configuration

The SDK accepts a single `InterfacerConfig` object with a `proxyUrl` that derives all other service endpoints automatically. Every field is optional — the SDK uses sensible defaults where possible.

## One-Line Setup

Pass a `proxyUrl` and everything is derived:

<Playground label="Derived Config" :code="proxyDemo" />

## Derived Endpoint Paths

When you provide a `proxyUrl`, the following are derived:

| Config field | Derived path |
|---|---|
| `zenflowsUrl` | `${proxyUrl}/zenflows/api` |
| `zenflowsFileUrl` | `${proxyUrl}/zenflows/api/file` |
| `dppUrl` | `${proxyUrl}/interfacer-dpp` |
| `inbox.send` | `${proxyUrl}/inbox/send` |
| `inbox.read` | `${proxyUrl}/inbox/read` |
| `inbox.countUnread` | `${proxyUrl}/inbox/count-unread` |
| `inbox.setRead` | `${proxyUrl}/inbox/set-read` |
| `walletUrl` | `${proxyUrl}/wallet/token` |
| `social.personBase` | `${proxyUrl}/inbox/person` |
| `social.economicResourceBase` | `${proxyUrl}/inbox/economicresource` |
| `oshUrl` | `${proxyUrl}/osh` |

## Explicit URLs

Override any derived URL by passing it directly. Explicit values always take precedence over derivation:

<Playground label="Explicit Config" :code="explicitDemo" />

## Configuration Fields

### `InterfacerConfig`

| Field | Type | Description |
|---|---|---|
| `proxyUrl` | `string?` | Base proxy URL — all services derived from this |
| `zenflowsUrl` | `string?` | Zenflows GraphQL API (e.g. `/zenflows/api`) |
| `zenflowsFileUrl` | `string?` | Zenflows file storage endpoint |
| `dppUrl` | `string?` | DPP service base URL |
| `inbox.send` | `string?` | Outbox POST endpoint |
| `inbox.read` | `string?` | Inbox read endpoint |
| `inbox.countUnread` | `string?` | Unread count endpoint |
| `inbox.setRead` | `string?` | Mark-as-read endpoint |
| `walletUrl` | `string?` | Wallet token service URL |
| `social.personBase` | `string?` | ActivityPub person base URL |
| `social.economicResourceBase` | `string?` | ActivityPub economic resource base URL |
| `oshUrl` | `string?` | Open Source Hardware analysis service |
| `location.autocomplete` | `string?` | Location autocomplete endpoint |
| `location.lookup` | `string?` | Location reverse lookup endpoint |
| `zenflowsAdmin` | `string?` | Admin token for sign-up mutations |
| `loshId` | `string?` | Default commons agent ULID |
| `specs.machine` | `string?` | Machine ResourceSpecification ID |
| `specs.dpp` | `string?` | DPP ResourceSpecification ID |
| `specs.material` | `string?` | Material ResourceSpecification ID |
| `specs.product` | `string?` | Product ResourceSpecification ID |
| `specs.service` | `string?` | Service ResourceSpecification ID |
| `walletCycle.startDate` | `string?` | Wallet cycle start (ISO date) |
| `walletCycle.cycleLength` | `number?` | Days per cycle |

### `deriveEndpointsFromProxy`

Returns the full set of derived endpoints from a proxy URL without creating a config. Useful for inspecting or composing configs:

```ts
const endpoints = deriveEndpointsFromProxy("https://proxy.example.com");
// { zenflowsUrl, zenflowsFileUrl, dppUrl, inbox, walletUrl, social, oshUrl }
```

### `createConfig`

```ts
function createConfig(config: InterfacerConfig): InterfacerConfig
```

Returns a resolved config object. Fields explicitly set in `config` are kept; missing fields are derived from `proxyUrl`. Always use this wrapper — `InterfacerClient` calls it internally if you pass a raw config, but calling it yourself gives you the resolved config for inspection.

## Key Storage

The SDK needs to persist cryptographic keys between sessions. It uses the `KeyStorage` interface:

```ts
interface KeyStorage {
  getItem(key: string): string | null | undefined;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}
```

By default, `InterfacerClient` uses `localStorage` in browsers. You can inject your own storage for testing, SSR, or security.

### `createMemoryStorage`

In-memory storage for testing or non-browser environments. Keys are lost on page reload:

<Playground label="Memory Storage" :code="storageDemo" />

### Custom Storage Adapter

Implement `KeyStorage` with any backend — IndexedDB, secure enclave, or your own encrypted store:

<Playground label="Custom Adapter" :code="localsDemo" />

## Instance Variables

The SDK automatically fetches ResourceSpecification IDs from Zenflows via `getInstanceVariables`. These are cached after the first call:

<Playground label="Instance Variables" :code="instanceDemo" />

**Cache clearing:** Call `clearInstanceVariablesCache()` when switching between servers or environments (e.g., staging → production).

## Environment Setup (from `interfacer-gui`)

Here is the real-world pattern used in the Interfacer GUI application:

```ts
import { InterfacerClient, createConfig } from "@dyne/interfacer-client";

const client = new InterfacerClient(
  createConfig({
    proxyUrl: process.env.NEXT_PUBLIC_PROXY_URL,
    zenflowsAdmin: process.env.NEXT_PUBLIC_ZENFLOWS_ADMIN,
    specs: {
      machine: process.env.NEXT_PUBLIC_SPEC_MACHINE,
      dpp: process.env.NEXT_PUBLIC_SPEC_DPP,
    },
  })
);
```

With a single `proxyUrl` environment variable, all 10+ service endpoints are derived automatically.

## Next Steps

- [Tagging System](/guides/tagging-system) — classification and filter tags
- [Authentication](/getting-started/authentication) — full Keypairoom auth flow
- [Architecture](/guides/architecture) — how the facade pattern wires everything together
