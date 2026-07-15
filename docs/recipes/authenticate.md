# Authenticate

End-to-end Keypairoom authentication in one page.

## Prerequisites

- A configured `InterfacerClient` with `zenflowsUrl` pointing to a running Zenflows instance
- `zenroom` installed as a peer dependency

## Full Flow

<<< @/../examples/authentication.ts

## Step-by-Step

### 1. Request HMAC

```ts
const hmac = await client.auth.requestHmac(email, true);
// firstRegistration: true = sign-up, false = sign-in
```

The server returns a base64-encoded HMAC shard. This is half of the key material.

### 2. Derive Keys

```ts
const keyring = await client.auth.deriveKeys(challenges, email, hmac);
```

Zenroom (WASM) takes the 5 challenge answers + email + HMAC and produces a `Keyring`:

```ts
{
  eddsa: "...",            // Ed25519 private key
  eddsa_public_key: "...",
  ethereum: "...",         // secp256k1
  ethereum_address: "0x...",
  reflow: "...",
  reflow_public_key: "...",
  bitcoin: "...",
  bitcoin_public_key: "...",
  ecdh: "...",             // X25519
  ecdh_public_key: "...",
  seed: "five word mnemonic phrase"
}
```

### 3. Register

```ts
await client.auth.registerUser({ name, user, email });
```

Sends all public keys to Zenflows. Requires `zenflowsAdmin` in config for some deployments.

### 4. Login

```ts
const profile = await client.auth.login({ email });
```

Verifies the email + EdDSA public key match. Enables GraphQL request signing.

## Returning Users

Skip challenges by using the saved seed:

```ts
const seed = store.getItem("seed");
const hmac = await client.auth.requestHmac(email, false);
await client.auth.recreateKeys(seed, hmac);
await client.auth.login({ email });
```

## Error Recovery

| Scenario | Fix |
|----------|-----|
| Email already registered | Use `recreateKeys` + `login` instead of `deriveKeys` + `register` |
| HMAC not returned | Check Zenflows is running; email may not exist |
| Key derivation fails | Ensure Zenroom WASM loaded; check COOP/COEP headers in browser |
| Registration fails | `zenflowsAdmin` token may be needed; check server logs |
