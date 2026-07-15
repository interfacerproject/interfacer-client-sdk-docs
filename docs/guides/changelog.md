# Changelog

## v0.1.0

First public release.

### Features

- **InterfacerClient** facade with lazy sub-client initialization
- **AuthClient** — Keypairoom authentication with EdDSA signing
- **ResourceClient** — Project/Resource CRUD with ValueFlows vocabulary
- **FileClient** — SHA-512 (Zenroom) + SHA-256 (Web Crypto) hashing
- **DppClient** — Digital Product Passport REST API
- **InboxClient** — Signed messaging and notifications
- **WalletClient** — Idea and Strength token points system
- **SocialClient** — ActivityPub-based likes and follows
- **TaggingClient** — Classification with 15+ tag prefixes, numeric ranges
- **ImportClient** — GitHub and GitLab auto-import
- **GraphQLClient** — Fetch-based GraphQL with automatic request signing
- **KeyStorage** — localStorage and in-memory persistence adapters
- **Auto-derivation** of endpoints from a single `proxyUrl`
- **TypeScript** strict mode, comprehensive type definitions
