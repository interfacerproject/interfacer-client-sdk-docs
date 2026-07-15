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

You can also specify each endpoint explicitly:

```ts
const client = new InterfacerClient({
  zenflowsUrl: "https://proxy.example.com/zenflows/api",
  zenflowsFileUrl: "https://proxy.example.com/zenflows/api/file",
  dppUrl: "https://proxy.example.com/interfacer-dpp",
  inbox: {
    send: "https://proxy.example.com/inbox/send",
    read: "https://proxy.example.com/inbox/read",
    countUnread: "https://proxy.example.com/inbox/count-unread",
    setRead: "https://proxy.example.com/inbox/set-read",
  },
  walletUrl: "https://proxy.example.com/wallet/token",
  social: {
    personBase: "https://proxy.example.com/inbox/person",
    economicResourceBase: "https://proxy.example.com/inbox/economicresource",
  },
});
```

## 2. Check Status

```ts
console.log("Authenticated:", client.isAuthenticated()); // false
console.log("Public key:", client.getPublicKey()); // null
```

## 3. Access Sub-Clients

All sub-clients are lazily initialized:

```ts
client.auth; // AuthClient
client.resources; // ResourceClient
client.files; // FileClient
client.dpp; // DppClient
client.inbox; // InboxClient
client.wallet; // WalletClient
client.social; // SocialClient
client.tagging; // TaggingClient
client.import; // ImportClient
```

## Next Steps

- [Authenticate](/getting-started/authentication) — full Keypairoom auth flow
- [Client Guide](/guides/client) — deep dive into the facade architecture
- [Recipes](/recipes/authenticate) — task-oriented walkthroughs
