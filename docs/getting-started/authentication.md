---
layout: doc
---

<script setup>
const flowDemo = `// Keypairoom authentication — 5-step flow

console.log('1. Request HMAC');
console.log('   const hmac = await client.auth.requestHmac(');
console.log('     "alice@example.com", true);');
console.log('');
console.log('2. Derive keys from 5 challenge answers');
console.log('   const keyring = await client.auth.deriveKeys(');
console.log('     { whereParentsMet, nameFirstPet,');
console.log('       nameFirstTeacher, whereHomeTown,');
console.log('       nameMotherMaid },');
console.log('     email, hmac);');
console.log('');
console.log('3. Register on Zenflows');
console.log('   await client.auth.registerUser({');
console.log('     name: "Alice", user: "alice",');
console.log('     email: "alice@example.com"');
console.log('   });');
console.log('');
console.log('4. Login (enable signing)');
console.log('   const profile = await client.auth.login({');
console.log('     email: "alice@example.com"');
console.log('   });');
console.log('');
console.log('5. Check status');
console.log('   client.isAuthenticated() // -> true');
console.log('');
console.log('Shortcut: client.register() combines steps 1-4';`;

const compositeDemo = `// client.register() — full flow in one call

console.log('await client.register({');
console.log('  name: "Alice",');
console.log('  username: "alice",');
console.log('  email: "alice@example.com",');
console.log('  challenges: {');
console.log('    whereParentsMet: "Paris",');
console.log('    nameFirstPet: "Rex",');
console.log('    nameFirstTeacher: "Smith",');
console.log('    whereHomeTown: "Berlin",');
console.log('    nameMotherMaid: "Jones",');
console.log('  }');
console.log('});');
console.log('');
console.log('// Does all of this:');
console.log('// requestHmac -> deriveKeys -> registerUser -> login';
console.log('');
console.log('// Check auth status');
console.log('console.log(client.isAuthenticated());   // true');
console.log('console.log(client.getPublicKey());      // "eddsa_public_key_base64"';`;
</script>

# Authentication

The SDK uses **Keypairoom** — deterministic key derivation from 5 personal challenge questions plus a server-side HMAC shard. All keys are generated via Zenroom WebAssembly.

## 5-Step Flow

<Playground label="Flow" :code="flowDemo" />

## Shortcut: `client.register()`

For the common case, the full 4-step registration is available as a single call:

<Playground label="Register" :code="compositeDemo" />

## Manual Steps

### Step 1: Request HMAC

```ts
const hmac = await client.auth.requestHmac("user@example.com", true);
// firstRegistration: true = sign-up, false = sign-in
```

Returns the server-side HMAC shard as a base64 string. On sign-in with an existing email, pass `false`.

### Step 2: Derive Keys

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

The same 5 answers always produce the same keys. Persist the seed:

```ts
const seed = client.store.getItem("seed"); // 5-word mnemonic
```

### Step 2b: Recreate Keys (Returning User)

```ts
const keyring = await client.auth.recreateKeys(seed, hmac);
```

Use this on login — pass the stored seed and a fresh HMAC.

### Step 3: Register

```ts
await client.auth.registerUser({
  name: "Alice",
  user: "alice",
  email: "user@example.com",
});
```

Requires the public keys from step 2 to be in the store. May need `zenflowsAdmin` token in the config for the sign-up mutation.

### Step 4: Login & Enable Signing

```ts
const profile = await client.auth.login({ email: "user@example.com" });
// → { id, name, username, email, isVerified, location?, image? }
```

After login, all subsequent mutations are automatically signed.

### Post-Registration

```ts
await client.auth.sendEmailVerification();
await client.auth.claimDid(profile.id);
```

### Logout

```ts
client.auth.logout(); // Clears all keys from storage
```

## Keyring

| Keypair | Algorithm | Usage |
|---------|-----------|-------|
| EdDSA | Ed25519 | GraphQL mutations, DID signatures |
| Ethereum | secp256k1 | EVM chains |
| Reflow | — | Interfacer network |
| Bitcoin | secp256k1 | BTC |
| ECDH | X25519 | Encrypted messaging |

## Error Handling

```ts
try {
  await client.auth.registerUser({ ... });
} catch (err) {
  // "email has already been registered"
  // "Missing keys. Derive keys first."
  // "zenflowsAdmin token required for sign-up"
}
```

## Next Steps

- [Signing & Crypto](/guides/signing-and-crypto) — how EdDSA signing works
- [Configuration](/guides/configuration) — KeyStorage and endpoint setup
- [Create Resource](/recipes/create-resource) — create projects after auth
