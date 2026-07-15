# Requests

The SDK uses two transport mechanisms:

| Transport | Used By | Auth |
|-----------|---------|------|
| **GraphQL (POST)** | Zenflows API | EdDSA-signed headers |
| **REST** | DPP, Inbox, Wallet, Social | `did-sign` + `did-pk` headers |

## GraphQL Requests

Handled by `GraphQLClient`. After login, requests are automatically signed.

```ts
// Direct query access
const result = await client.graphql.request(`
  query FetchResources($filter: ResourceFilter) {
    economicResources(filter: $filter) { id name }
  }
`, { filter: {} });
```

### Signing

```ts
// Enable after authentication
client.graphql.setSigningEnabled(true);

// Sign manually (for custom integrations)
import { signGraphQLRequest } from "@dyne/interfacer-client";
const headers = await signGraphQLRequest(body, keyStore);
```

### Instance Variables

Cached global configuration from the Zenflows deployment:

```ts
import { getInstanceVariables, clearInstanceVariablesCache } from "@dyne/interfacer-client";

const vars = await getInstanceVariables(client.graphql);
// vars.projectDesign, vars.projectProduct, vars.machine, vars.dpp, vars.unitOne

clearInstanceVariablesCache(); // Force re-fetch
```

## REST Requests

### DPP (Digital Product Passport)

```ts
const dpp = await client.dpp.createDpp({ productOverview: { name: "..." } });
// Headers: did-sign, did-pk, x-user-id
```

### Inbox (Messaging)

```ts
await client.inbox.sendMessage(
  { proposalId: "..." },
  ["receiverId"],
  "Subject"
);
```

### Wallet

```ts
const balance = await client.wallet.getBalance(agentId, Token.Idea);
```

### Social

```ts
await client.social.likeResource(resourceId);
// Posts ActivityStreams Like to outbox
```
