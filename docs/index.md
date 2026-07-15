---
layout: home

hero:
  name: "Interfacer Client SDK"
  text: "TypeScript SDK for the Interfacer Ecosystem"
  tagline: Zenflows · DPP · Inbox · Wallet · Social — one unified client.
  image:
    src: /logo.svg
    alt: Interfacer
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/installation
    - theme: alt
      text: View on GitHub
      link: https://github.com/interfacerproject/interfacer-client

features:
  - icon: 🔐
    title: Keypairoom Authentication
    details: Deterministic key derivation from 5 challenge questions with EdDSA signing. Full login/register flow with Zenroom WASM crypto.
    link: /getting-started/authentication
  - icon: 📦
    title: Resource Management
    details: CRUD for Design, Product, Service, and Machine resources. Proposals, contributions, citations — built on ValueFlows vocabulary.
    link: /recipes/create-resource
  - icon: 🏷️
    title: Digital Product Passport
    details: REST API for supply chain and sustainability data. QR codes, file attachments, SHA-256 integrity checks.
    link: /recipes/dpp-create-and-query
  - icon: 🏷️
    title: Tagging & Classification
    details: 15 tag prefixes, numeric range bounding, derived filter tags. Fully client-side normalization and merge.
    link: /guides/tagging-system
  - icon: 💬
    title: Social & Messaging
    details: ActivityPub-based likes and follows. EdDSA-signed inbox for notifications and proposals.
    link: /recipes/send-message
  - icon: 💰
    title: Wallet & Points
    details: Idea and Strength tokens. Balance queries, point-in-time lookups, trend analysis.
    link: /recipes/wallet-points
---

## Architecture

```text
InterfacerClient
├── auth        — Keypairoom auth, EdDSA signing, login/register
├── graphql     — Fetch-based client with auto-signing
├── resources   — Project/Resource CRUD, proposals, contributions
├── files       — File hashing (SHA-512 via Zenroom, SHA-256 via Web Crypto)
├── dpp         — Digital Product Passport operations
├── inbox       — Messaging & notifications
├── wallet      — Idea/Strength points
├── social      — ActivityPub likes & follows
├── tagging     — Classification (15+ tag prefixes, numeric ranges)
└── import      — GitHub/GitLab auto-import
```

## Quick Navigation

### Getting Started
- [Installation](/getting-started/installation) — npm, CDN, ESM
- [Quick Start](/getting-started/quick-start) — 5-minute setup
- [Authentication](/getting-started/authentication) — full Keypairoom flow

### Guides
- [Client](/guides/client) — facade architecture & sub-client access
- [Configuration](/guides/configuration) — all config fields, proxyUrl derivation, KeyStorage
- [Tagging System](/guides/tagging-system) — classification, normalization, numeric ranges
- [Files & Hashing](/guides/files-and-hashing) — Zenflows/DPP uploads, image helpers
- [Signing & Crypto](/guides/signing-and-crypto) — EdDSA, DID headers, keyring
- [Apollo Migration](/guides/apollo-migration) — drop-in hooks for migrating from Apollo

### Recipes
- [Authenticate](/recipes/authenticate) — step-by-step auth
- [Create Resource](/recipes/create-resource) — project creation
- [Apply Tags & Filters](/recipes/apply-tags-and-filters) — full tag assembly pipeline
- [Upload Document](/recipes/upload-document) — file hashing & uploads
- [DPP Create & Query](/recipes/dpp-create-and-query) — passport lifecycle
- [Send & Read Messages](/recipes/send-message) — inbox & notifications
- [Wallet Points](/recipes/wallet-points) — idea/strength tokens & trends
- [Like & Follow](/recipes/like-and-follow) — ActivityPub social features
- [Import GitHub/GitLab](/recipes/import-github-repo) — auto-populate from repos

### API Reference
- [All Classes](/api/README) — auto-generated from TypeScript declarations

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #00B4A6 30%, #1A9E91);
}
</style>
