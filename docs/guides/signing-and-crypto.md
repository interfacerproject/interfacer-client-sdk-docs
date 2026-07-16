---
layout: doc
---

<script setup>
const keypairDemo = `import { createMemoryStorage } from '@dyne/interfacer-client';

// Simulate the keypair derivation flow
// This is done automatically by AuthClient.deriveKeys()

console.log('// Keypair storage keys (written by deriveKeys):');
console.log('const KEYS = {');
console.log('  eddsaPrivateKey,         // for signing');
console.log('  eddsaPublicKey,          // for verifying');
console.log('  ethereumPrivateKey,      // Ethereum chain');
console.log('  ethereumAddress,');
console.log('  reflowPrivateKey,        // Reflow network');
console.log('  reflowPublicKey,');
console.log('  bitcoinPrivateKey,       // Bitcoin chain');
console.log('  bitcoinPublicKey,');
console.log('  ecdhPrivateKey,          // Encrypted messaging');
console.log('  ecdhPublicKey,');
console.log('  seed,                    // 12-word mnemonic');
console.log('};');
console.log('');
console.log('// deriveKeys: challenges + email + HMAC -> keyring');
console.log('// recreateKeys: seed phrase + HMAC -> keyring');
console.log('// Both persist to the configured KeyStorage');`;

const signingDemo = `// signingDemo — shows headers structure, not live Zenroom

console.log('// signGraphQLRequest(body, store)');
console.log('//');
console.log('// Input: any string (GraphQL JSON body)');
console.log('// Returns:');
console.log('{');
console.log('  "zenflows-sign": "encoded_signature...",');
console.log('  "zenflows-user": "alice@example.com",');
console.log('  "zenflows-hash": "hash_of_body",');
console.log('}');
console.log('');
console.log('// Flow:');
console.log('// body -> base64 -> Zenroom sign_graphql.zen');
console.log('// -> eddsa_signature + hash');
console.log('//');
console.log('// These headers are auto-attached by GraphQLClient');
console.log('// when setSigningEnabled(true). No manual calls needed');`;

const didDemo = `// DPP REST API uses different header scheme

console.log('// signDidRequest(body, store)');
console.log('//');
console.log('// Input: JSON string body');
console.log('// Returns:');
console.log('{');
console.log('  "did-sign": "encoded_signature...",');
console.log('  "did-pk": "eddsa_public_key",');
console.log('}');
console.log('');
console.log('// Used by DppClient for all REST operations:');
console.log('// createDpp, updateDpp, deleteDpp,');
console.log('// listDpps, addAttachment');
console.log('');
console.log('// File uploads use signFileUpload instead:');`;
</script>

# Signing & Crypto

All authenticated operations (mutations, DPP API calls, wallet points, inbox messages, file uploads) are cryptographically signed using EdDSA keys derived via Zenroom's Keypairoom protocol.

## Key Architecture

The SDK manages a **keyring** — a set of 5 keypairs derived from user challenges + a server-side HMAC shard:

<Playground label="Keyring" :code="keypairDemo" />

### Two Derivation Flows

| Flow | Input | Used For |
|------|-------|----------|
| `deriveKeys(challenges, email, hmac, store)` | 5 challenge answers + HMAC | First-time registration |
| `recreateKeys(seed, hmac, store)` | 12-word seed mnemonic + HMAC | Returning user login |

Both produce the same keyring. After derivation, all keys are persisted to the configured `KeyStorage` (default: `localStorage`).

## GraphQL Request Signing

Mutations on Zenflows require signed headers. The `GraphQLClient` handles this automatically when signing is enabled:

```ts
// Keys derived? Signing auto-enabled after login
await client.auth.login({ email: "alice@example.com" });

// All subsequent mutations are signed automatically:
await client.resources.createProject({ ... });
await client.wallet.addPoints(agentId, Token.Idea, 1);
```

<Playground label="Signing Headers" :code="signingDemo" />

### Manual Signing

For raw GraphQL queries (bypassing sub-clients), you can sign manually:

```ts
import { signGraphQLRequest } from "@dyne/interfacer-client";

const headers = await signGraphQLRequest(
  JSON.stringify({ query: "mutation { ... }" }),
  client.store
);

const res = await fetch(config.zenflowsUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json", ...headers },
  body: JSON.stringify({ query: "mutation { ... }" }),
});
```

## DPP Signing (DID Headers)

The DPP microservice uses a different header format (`did-sign` + `did-pk`):

<Playground label="DID Signing" :code="didDemo" />

### File Upload Signing

DPP file uploads (`addAttachment`, `uploadFileToDpp`) sign the **raw hex SHA-256 checksum** of the file, not the base64-encoded body:

```ts
import { signFileUpload, hashFileSHA256 } from "@dyne/interfacer-client";

const checksum = await hashFileSHA256(file);
const signature = await signFileUpload(checksum, client.store);

const formData = new FormData();
formData.append("file", file);

await fetch(`${dppUrl}/upload`, {
  method: "POST",
  headers: {
    "did-pk": client.store.getItem("eddsaPublicKey") || "",
    "did-sign": signature,
  },
  body: formData,
});
```

## Signing Contract

All signing uses the `sign_graphql.zen` Zenroom contract:

1. Takes input as `{ gql: base64EncodedBody }`
2. Signs with EdDSA private key from keyring
3. Returns `{ eddsa_signature, hash }`

The contract is loaded from `@dyne/interfacer-client/src/zenflows-crypto/src/sign_graphql.zen` at import time (not at runtime).

## Storage Keys

The SDK uses these keys in `KeyStorage`:

| Key | Purpose |
|-----|---------|
| `eddsaPrivateKey` | Primary signing key (all operations) |
| `eddsaPublicKey` | Signature verification, DID headers |
| `seed` | 12-word mnemonic for `recreateKeys` |
| `ethereumAddress` | Ethereum wallet address |
| `ecdhPublicKey` | Encrypted messaging endpoint |
| `bitcoinPublicKey` | Bitcoin wallet |
| `reflowPublicKey` | Reflow network |
| `authUsername` | Zenflows username header |

## Enabling/Disabling Signing

Signing is explicitly controlled via `GraphQLClient`:

```ts
// Enable (automatic after login)
client.graphql.setSigningEnabled(true);

// Disable (useful for public queries or testing)
client.graphql.setSigningEnabled(false);
```

## Next Steps

- [Authentication](/getting-started/authentication) — full Keypairoom auth flow
- [Files & Hashing](/guides/files-and-hashing) — file upload signing in practice
- [Configuration](/guides/configuration) — KeyStorage setup
