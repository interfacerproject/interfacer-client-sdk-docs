# Installation

## npm / pnpm

```bash
pnpm add @dyne/interfacer-client zenroom
```

`zenroom` is a **peer dependency** — it provides the WASM-based cryptographic VM used for key derivation and EdDSA signing.

## Import

```ts
import { InterfacerClient } from "@dyne/interfacer-client";
```

## Browser / CDN

For browser-only environments (no Node.js), load from **esm.sh**:

```ts
const { InterfacerClient } = await import(
  "https://esm.sh/@dyne/interfacer-client"
);
```

## Requirements

- **Node.js** ≥ 18 (for npm/pnpm)
- **TypeScript** ≥ 5.5
- **Zenroom** ≥ 5.36.1 (peer dependency)
