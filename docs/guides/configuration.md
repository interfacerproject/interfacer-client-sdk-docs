---
layout: doc
---

<script setup>
const proxyDemo = `import {
  InterfacerClient, createConfig, deriveEndpointsFromProxy
} from '@dyne/interfacer-client';

// One-line config — all 10+ endpoints derived automatically
const config = createConfig({
  proxyUrl: 'https://proxy.dpp-dev.ddns.dyne.org',
});

const client = new InterfacerClient(config);

// Inspect derived endpoints
console.log('proxyUrl:', config.proxyUrl);
console.log('');
console.log('zenflowsUrl:      ', config.zenflowsUrl);
console.log('zenflowsFileUrl:  ', config.zenflowsFileUrl);
console.log('dppUrl:           ', config.dppUrl);
console.log('inbox.send:       ', config.inbox.send);
console.log('inbox.read:       ', config.inbox.read);
console.log('inbox.countUnread:', config.inbox.countUnread);
console.log('inbox.setRead:    ', config.inbox.setRead);
console.log('walletUrl:        ', config.walletUrl);
console.log('social.personBase:', config.social.personBase);
console.log('social.erBase:    ', config.social.economicResourceBase);
console.log('oshUrl:           ', config.oshUrl);`;

const explicitDemo = `import { InterfacerClient, createConfig } from '@dyne/interfacer-client';

// Full explicit control — every endpoint passed directly
// (the pattern used in interfacer-gui)
const config = createConfig({
  zenflowsUrl: process.env.NEXT_PUBLIC_ZENFLOWS_URL || '',
  zenflowsFileUrl: process.env.NEXT_PUBLIC_ZENFLOWS_FILE_URL || '',
  dppUrl: process.env.NEXT_PUBLIC_DPP_URL || '',
  feedbackUrl: process.env.NEXT_PUBLIC_FEEDBACK_URL || '',
  inbox: {
    send: process.env.NEXT_PUBLIC_INBOX_SEND || '',
    read: process.env.NEXT_PUBLIC_INBOX_READ || '',
    countUnread: process.env.NEXT_PUBLIC_INBOX_COUNT_UNREAD || '',
    setRead: process.env.NEXT_PUBLIC_INBOX_SET_READ || '',
  },
  walletUrl: process.env.NEXT_PUBLIC_WALLET || '',
  social: {
    personBase: process.env.NEXT_PUBLIC_SOCIAL_PERSON || '',
    economicResourceBase:
      process.env.NEXT_PUBLIC_SOCIAL_ECONOMIC_RESOURCE || '',
  },
  oshUrl: process.env.NEXT_PUBLIC_OSH || '',
  loshId: process.env.NEXT_PUBLIC_LOSH_ID || '',
  zenflowsAdmin: process.env.NEXT_PUBLIC_ZENFLOWS_ADMIN || '',
  specs: {
    machine: process.env.NEXT_PUBLIC_SPEC_MACHINE || '',
    dpp: process.env.NEXT_PUBLIC_SPEC_DPP || '',
  },
});

const client = new InterfacerClient(config);`;

const deriveDemo = `import { deriveEndpointsFromProxy } from '@dyne/interfacer-client';

// Inspect derived endpoints without creating a client
const endpoints = deriveEndpointsFromProxy(
  'https://proxy.dpp-dev.ddns.dyne.org'
);

console.log(endpoints.zenflowsUrl);
// -> https://proxy.dpp-dev.ddns.dyne.org/zenflows/api
console.log(endpoints.dppUrl);
// -> https://proxy.dpp-dev.ddns.dyne.org/interfacer-dpp
console.log(endpoints.inbox.send);
// -> https://proxy.dpp-dev.ddns.dyne.org/inbox/send

// Useful for debugging, logging, or composing configs manually`;
</script>

# Configuration

The SDK is configured through a single `InterfacerConfig` object passed to `createConfig()` then `new InterfacerClient()`. There are two setup modes: **derived** (one `proxyUrl` → everything) and **explicit** (every endpoint passed directly like in the GUI).

## Two Setup Modes

### Derived Mode (one URL)

Best for simple setups — pass `proxyUrl` and all 10+ endpoints are computed automatically:

<!-- <Playground label="Derived" :code="proxyDemo" /> -->

### Explicit Mode (full control)

The pattern used in `interfacer-gui` — every endpoint comes from environment variables. Explicit values always take precedence over derivation:

<!-- <Playground label="Explicit (GUI pattern)" :code="explicitDemo" /> -->

Use this when you need different URLs per environment (dev/staging/prod) or when services live on different hosts.

## Every Config Field

The `InterfacerConfig` interface:

```ts
interface InterfacerConfig {
  proxyUrl?: string;
  zenflowsUrl?: string;
  zenflowsFileUrl?: string;
  dppUrl?: string;
  feedbackUrl?: string;
  inbox?: { send: string; read: string; countUnread: string; setRead: string };
  walletUrl?: string;
  social?: { personBase: string; economicResourceBase: string };
  oshUrl?: string;
  location?: { autocomplete: string; lookup: string };
  specs?: { dpp?: string; machine?: string; material?: string; product?: string; service?: string };
  zenflowsAdmin?: string;
  loshId?: string;
  walletCycle?: { startDate: string; cycleLength: number };
}
```

Every field is optional — the SDK works with whatever you provide.

### `proxyUrl`

| Property | |
|---|---|
| **Type** | `string \| undefined` |
| **Required** | No — but when present, derives all other endpoints |
| **Derives** | 10 endpoints (see table below) |
| **Breaks if missing** | Nothing — just don't call modules whose URLs aren't set |

When `proxyUrl` is provided, `createConfig()` fills in any endpoint URLs that aren't explicitly passed. Explicit values always win.

### `zenflowsUrl`

| Property | |
|---|---|
| **Type** | `string \| undefined` |
| **Required for** | Authentication, all GraphQL operations (resources, projects) |
| **Derived from `proxyUrl`** | `${proxyUrl}/zenflows/api` |
| **GUI env var** | `NEXT_PUBLIC_ZENFLOWS_URL` |
| **Breaks if missing** | `client.auth.*`, `client.resources.*`, `client.graphql.*` |

The Zenflows GraphQL API — this is the core backend. Nearly every operation except purely client-side ones (tagging) goes through this endpoint.

### `zenflowsFileUrl`

| Property | |
|---|---|
| **Type** | `string \| undefined` |
| **Required for** | File uploads to Zenflows |
| **Derived from `proxyUrl`** | `${proxyUrl}/zenflows/api/file` |
| **GUI env var** | `NEXT_PUBLIC_ZENFLOWS_FILE_URL` |
| **Breaks if missing** | `client.files.uploadToZenflows()`, `client.files.uploadToZenflowsBatch()` |

This is the FormData upload endpoint for Zenflows file storage — separate from the GraphQL API. Files are uploaded by hash as the form field name.

### `dppUrl`

| Property | |
|---|---|
| **Type** | `string \| undefined` |
| **Required for** | All DPP operations, DPP file uploads |
| **Derived from `proxyUrl`** | `${proxyUrl}/interfacer-dpp` |
| **GUI env var** | `NEXT_PUBLIC_DPP_URL` |
| **Breaks if missing** | `client.dpp.*`, `client.files.uploadToDpp()`, `client.files.uploadModelsToDpp()` |

The Digital Product Passport REST API. Uses DID-signing headers for all mutating requests.

### `feedbackUrl`

| Property | |
|---|---|
| **Type** | `string \| undefined` |
| **Required for** | Reviews and comments (feedback service) |
| **Derived from `proxyUrl`** | ❌ Not derived — must be set explicitly |
| **GUI env var** | `NEXT_PUBLIC_FEEDBACK_URL` |
| **Breaks if missing** | `client.feedback.*` |

The feedback service is a standalone REST API, not proxied through the same gateway. Always set this explicitly.

### `inbox`

| Property | |
|---|---|
| **Type** | `{ send: string; read: string; countUnread: string; setRead: string } \| undefined` |
| **Required for** | Sending/receiving messages |
| **Derived from `proxyUrl`** | All 4 paths derived |
| **GUI env vars** | `NEXT_PUBLIC_INBOX_SEND`, `NEXT_PUBLIC_INBOX_READ`, `NEXT_PUBLIC_INBOX_COUNT_UNREAD`, `NEXT_PUBLIC_INBOX_SET_READ` |
| **Breaks if missing** | `client.inbox.*` |

Four separate REST endpoints for the inbox service. All are signed with EdDSA. In derived mode, the paths follow the convention:

| Sub-field | Derived path |
|---|---|
| `inbox.send` | `${proxyUrl}/inbox/send` |
| `inbox.read` | `${proxyUrl}/inbox/read` |
| `inbox.countUnread` | `${proxyUrl}/inbox/count-unread` |
| `inbox.setRead` | `${proxyUrl}/inbox/set-read` |

### `walletUrl`

| Property | |
|---|---|
| **Type** | `string \| undefined` |
| **Required for** | Wallet point operations |
| **Derived from `proxyUrl`** | `${proxyUrl}/wallet/token` |
| **GUI env var** | `NEXT_PUBLIC_WALLET` |
| **Breaks if missing** | `client.wallet.*` |

The wallet token REST API — Idea and Strength point balances, awards, and trends.

### `social`

| Property | |
|---|---|
| **Type** | `{ personBase: string; economicResourceBase: string } \| undefined` |
| **Required for** | Legacy ActivityPub likes/follows |
| **Derived from `proxyUrl`** | Both paths derived |
| **GUI env vars** | `NEXT_PUBLIC_SOCIAL_PERSON`, `NEXT_PUBLIC_SOCIAL_ECONOMIC_RESOURCE` |
| **Breaks if missing** | `client.social.*` |

::: warning Legacy
Social (ActivityPub likes + follows) is **legacy retro-compatibility**. Project feedback now uses [Feedback & Reviews](/guides/feedback-reviews) via the `feedbackUrl`.
:::

| Sub-field | Derived path |
|---|---|
| `social.personBase` | `${proxyUrl}/inbox/person` |
| `social.economicResourceBase` | `${proxyUrl}/inbox/economicresource` |

### `oshUrl`

| Property | |
|---|---|
| **Type** | `string \| undefined` |
| **Required for** | Open Source Hardware compliance check |
| **Derived from `proxyUrl`** | `${proxyUrl}/osh` |
| **GUI env var** | `NEXT_PUBLIC_OSH` |
| **Breaks if missing** | `client.import.analyzeRepoForOsh()` |

Posts to `${oshUrl}/analyze` with a repo URL and returns `{ ok: true/false }`.

### `specs`

| Property | |
|---|---|
| **Type** | `{ dpp?: string; machine?: string; material?: string; product?: string; service?: string } \| undefined` |
| **Required for** | `createProject` (product/service), `createMachine`, `createDppResource` when instance variables aren't available |
| **Derived** | ❌ Not derived — fetched via `getInstanceVariables` or set explicitly |
| **GUI env vars** | `NEXT_PUBLIC_SPEC_MACHINE`, `NEXT_PUBLIC_SPEC_DPP` |
| **Breaks if missing** | Creation methods fall back to `getInstanceVariables`; if both are missing, creation throws |

ResourceSpecification IDs are ULID strings that identify the type of resource being created. They are normally fetched automatically from Zenflows via `getInstanceVariables()`. Set them explicitly in `specs` as a fallback or when the Zenflows instance doesn't expose them.

### `zenflowsAdmin`

| Property | |
|---|---|
| **Type** | `string \| undefined` |
| **Required for** | User registration mutations (sign-up) |
| **GUI env var** | `NEXT_PUBLIC_ZENFLOWS_ADMIN` |
| **Breaks if missing** | `client.auth.registerUser()` may fail |

The `SIGN_UP` GraphQL mutation requires an admin token. This is a server-side secret — expose only in a secure backend, not in client code going to end users.

### `loshId`

| Property | |
|---|---|
| **Type** | `string \| undefined` |
| **Required for** | Transfer events involving the commons |

A ULID representing the default "losh" (commons) agent for resource transfer events.

### `walletCycle`

| Property | |
|---|---|
| **Type** | `{ startDate: string; cycleLength: number } \| undefined` |
| **Required for** | Wallet trend calculations |

```ts
walletCycle: {
  startDate: "2026-01-01", // ISO date
  cycleLength: 30,          // days
}
```

Used by `client.wallet.getTrend()` to compute point growth over a cycle.

## `deriveEndpointsFromProxy`

A pure utility — computes derived endpoints without creating a config:

<!-- <Playground label="Derive" :code="deriveDemo" /> -->

Returns a `DerivedEndpoints` object:

```ts
interface DerivedEndpoints {
  zenflowsUrl: string;
  zenflowsFileUrl: string;
  dppUrl: string;
  inbox: { send: string; read: string; countUnread: string; setRead: string };
  walletUrl: string;
  social: { personBase: string; economicResourceBase: string };
  oshUrl: string;
}
```

## `createConfig`

```ts
function createConfig(config: InterfacerConfig): InterfacerConfig
```

Wraps the raw config. If `proxyUrl` is set, fills in any missing derived endpoints. Explicitly-set fields always take precedence. `InterfacerClient` calls this internally, but calling it yourself lets you inspect the resolved config:

```ts
const resolved = createConfig(rawConfig);
console.log(resolved.zenflowsUrl); // guaranteed to be set if proxyUrl was provided
```

## Key Storage

The `InterfacerClient` constructor takes an optional second argument — a `KeyStorage` implementation:

```ts
interface KeyStorage {
  getItem(key: string): string | null | undefined;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}
```

**Default:** If no storage is provided, the SDK tries `localStorage` (browser). If `window` is unavailable (SSR), it falls back to `createMemoryStorage()`. You rarely need to touch this unless you're testing or running on a platform without `localStorage`.

### Built-in adapters

```ts
import { createMemoryStorage } from "@dyne/interfacer-client";

// Ephemeral in-memory storage — keys lost on page reload
const store = createMemoryStorage();
const client = new InterfacerClient(config, store);
```

### Custom storage

```ts
const client = new InterfacerClient(config, {
  getItem: (key) => mySecureEnclave.read(key),
  setItem: (key, value) => mySecureEnclave.write(key, value),
  removeItem: (key) => mySecureEnclave.delete(key),
  clear: () => mySecureEnclave.destroy(),
});
```

## Instance Variables

`getInstanceVariables()` fetches ResourceSpecification IDs from Zenflows at runtime. These are auto-called internally by `createProject`, `createMachine`, and `createDppResource`. The result is cached after the first fetch.

```ts
import { clearInstanceVariablesCache } from "@dyne/interfacer-client";

// Clear when switching servers (staging → production)
clearInstanceVariablesCache();
```

## Next Steps

- [Authentication](/getting-started/authentication) — puts the config to work with Keypairoom auth
- [Client Guide](/guides/client) — sub-client lazy accessor pattern
- [Architecture](/guides/architecture) — how all these endpoints connect
