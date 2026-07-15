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
  - icon: 📦
    title: Resource Management
    details: CRUD for Design, Product, Service, and Machine resources. Proposals, contributions, citations — built on ValueFlows vocabulary.
  - icon: 🏷️
    title: Digital Product Passport
    details: REST API for supply chain and sustainability data. QR codes, file attachments, SHA-256 integrity checks.
  - icon: 💬
    title: Social & Messaging
    details: ActivityPub-based likes and follows. EdDSA-signed inbox for notifications and proposals.
  - icon: 💰
    title: Wallet & Points
    details: Idea and Strength tokens. Balance queries, point-in-time lookups, trend analysis.
  - icon: 🏗️
    title: Facade Architecture
    details: Single entry point with lazy sub-clients. Shared config, key storage, and GraphQL signing.

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
├── tagging     — Classification system (15+ tag prefixes, numeric ranges)
└── import      — GitHub/GitLab auto-import
```

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #00B4A6 30%, #1A9E91);
}
</style>
