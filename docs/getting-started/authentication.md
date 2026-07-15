# Authentication

The SDK uses **Keypairoom** — a deterministic key derivation system based on 5 personal challenge questions plus a server-side HMAC shard.

## Flow

```text
1. Request HMAC  →  Server returns a shard
2. Derive Keys   →  Zenroom derives 5 keypairs from answers + HMAC
3. Register      →  Send public keys to Zenflows
4. Login         →  Verify identity, enable request signing
```

## Step 1: Request HMAC

```ts
const hmac = await client.auth.requestHmac("user@example.com", true);
// firstRegistration: true = sign-up, false = sign-in
```

## Step 2: Derive Keys

```ts
const keyring = await client.auth.deriveKeys(
  {
    whereParentsMet: "Paris",
    nameFirstPet: "Rex",
    nameFirstTeacher: "Smith",
    whereHomeTown: "Berlin",
    nameMotherMaid: "Jones",
  },
  "user@example.com",
  hmac
);
```

The same 5 answers always produce the same keys. Save the seed for later login:

```ts
const seed = keyring.seed; // 5-word mnemonic phrase
```

## Step 2b: Recreate Keys (Returning User)

```ts
const keyring = await client.auth.recreateKeys(seed, hmac);
```

## Step 3: Register

```ts
await client.auth.registerUser({
  name: "Alice",
  user: "alice",
  email: "user@example.com",
});
```

## Step 4: Login

```ts
const profile = await client.auth.login({ email: "user@example.com" });
// profile: { id, name, username, email, isVerified, location?, image? }
```

## Post-Registration

```ts
await client.auth.sendEmailVerification();
await client.auth.claimDid(profile.id);
```

## Keyring

| Keypair | Protocol | Use |
|---------|----------|-----|
| EdDSA | Ed25519 | GraphQL/DID signing |
| Ethereum | secp256k1 | EVM chains |
| Reflow | — | Interfacer internal |
| Bitcoin | secp256k1 | BTC |
| ECDH | X25519 | Key exchange |

## Key Persistence

By default, keys are stored in `localStorage`. Use `createMemoryStorage()` for ephemeral sessions:

```ts
import { createMemoryStorage } from "@dyne/interfacer-client";
const ephemeral = new InterfacerClient(config, createMemoryStorage());
```
