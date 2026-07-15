# Client

The `InterfacerClient` is the main entry point. It follows the **Facade pattern** — a single class that provides lazy access to specialized sub-clients.

## Constructor

```ts
import { InterfacerClient } from "@dyne/interfacer-client";

const client = new InterfacerClient(config, store?);
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `config` | `InterfacerConfig` | Yes | Service endpoint configuration |
| `store` | `KeyStorage` | No | Key persistence (default: localStorage) |

## Sub-Clients

All accessed via lazy getters. Each sub-client is initialized on first access.

```ts
client.auth        // AuthClient — Keypairoom auth, EdDSA
client.graphql     // GraphQLClient — queries, mutations, signing
client.resources   // ResourceClient — projects, machines, proposals
client.files       // FileClient — hashing, Zenflows/DPP uploads
client.dpp         // DppClient — Digital Product Passport CRUD
client.inbox       // InboxClient — messaging, notifications
client.wallet      // WalletClient — Idea/Strength points
client.social      // SocialClient — ActivityPub likes/follows
client.tagging     // TaggingClient — classification system
client.import      // ImportClient — GitHub/GitLab auto-import
```

## Convenience Methods

```ts
// Full registration flow (HMAC → derive → register → login)
await client.register({
  name: "Alice",
  username: "alice",
  email: "user@example.com",
  challenges: { ... },
});

// Auth status
client.isAuthenticated(); // boolean
client.getPublicKey();    // string | null
```

## Config

```ts
interface InterfacerConfig {
  proxyUrl?: string;              // Auto-derive all endpoints
  zenflowsUrl?: string;           // Zenflows GraphQL API
  zenflowsFileUrl?: string;       // Zenflows file storage
  dppUrl?: string;                // DPP REST API
  inbox?: { send, read, countUnread, setRead };
  walletUrl?: string;             // Wallet token endpoint
  social?: { personBase, economicResourceBase };
  oshUrl?: string;                // Open Source Hardware check
  zenflowsAdmin?: string;         // Admin token for sign-ups
  specs?: { dpp?, machine?, product?, service? };
  loshId?: string;                // Commons agent ULID
}
```

## KeyStorage

```ts
interface KeyStorage {
  getItem(key: string): string | null | undefined;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}
```

Built-in implementations:

```ts
import { createLocalStorageAdapter, createMemoryStorage } from "@dyne/interfacer-client";

const browserStore = createLocalStorageAdapter(); // localStorage
const ephemeral = createMemoryStorage();           // In-memory, non-persistent
```
