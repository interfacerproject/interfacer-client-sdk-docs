# Architecture

High-level overview of the Interfacer Client SDK.

## Facade Pattern

```text
InterfacerClient (facade)
├── config: InterfacerConfig     ← Service endpoints
├── store: KeyStorage            ← Key persistence
│
├── auth: AuthClient             ← Keypairoom + EdDSA
│   └── graphql: GraphQLClient   ← Fetch + auto-signing
│
├── resources: ResourceClient    ← Projects, machines, proposals
│   └── graphql: GraphQLClient
│
├── files: FileClient            ← SHA-512/256 hashing, uploads
├── dpp: DppClient               ← DPP REST API (did-sign)
├── inbox: InboxClient           ← Messaging REST API
├── wallet: WalletClient         ← Points REST API
├── social: SocialClient         ← ActivityPub REST API
├── tagging: TaggingClient       ← Client-side classification
└── import: ImportClient         ← GitHub/GitLab REST API
```

## Request Flow

```text
App Code
  │
  ▼
InterfacerClient.xxx.method()
  │
  ├── GraphQLClient.request()
  │     │
  │     ├── signGraphQLRequest()  ← EdDSA signing
  │     └── fetch(url, { body, headers })
  │
  ├── DppClient.request()
  │     │
  │     ├── signDidRequest()      ← DID signing
  │     └── fetch(url, { body, headers })
  │
  └── InboxClient / WalletClient / SocialClient
        │
        ├── signGraphQLRequest()
        └── fetch(url, { body, headers })
```

## Key Storage Flow

```text
deriveKeys(challenges, email, hmac)
  │
  ▼
Zenroom (WASM) ─── produces Keyring
  │
  ▼
KeyStorage.setItem() ─── persists to localStorage
  │
  ├── eddsaPrivateKey
  ├── eddsaPublicKey
  ├── ethereumPrivateKey
  ├── ethereumAddress
  ├── reflowPrivateKey
  ├── reflowPublicKey
  ├── bitcoinPrivateKey
  ├── bitcoinPublicKey
  ├── ecdhPrivateKey
  ├── ecdhPublicKey
  ├── seed
  ├── authId
  └── authEmail
```

## Services

| Service | Protocol | Auth | SDK Client |
|---------|----------|------|------------|
| Zenflows | GraphQL (POST) | EdDSA headers | `GraphQLClient` |
| DPP | REST | `did-sign` + `did-pk` | `DppClient` |
| Inbox | REST (POST) | EdDSA signed body | `InboxClient` |
| Wallet | REST (GET/POST) | EdDSA signed body | `WalletClient` |
| Social | REST (POST/GET) | EdDSA signed body | `SocialClient` |
| Zenroom | WASM (local) | N/A | Internal |
