---
layout: page
---

<script setup>
const reviewDemo = `// interfacer-feedback-service — REST API for reviews & comments
// Currently consumed directly in the GUI, not yet in the SDK.

console.log('// Reviews (1-5 stars + optional text)');
console.log('');
console.log('// POST   /api/v1/projects/:ulid/reviews');
console.log('// GET    /api/v1/projects/:ulid/reviews');
console.log('// GET    /api/v1/projects/:ulid/reviews/summary');
console.log('// GET    /api/v1/projects/:ulid/reviews/mine');
console.log('// DELETE /api/v1/reviews/:id');
console.log('');
console.log('// Comments (threaded, replies via parent_id)');
console.log('');
console.log('// POST   /api/v1/projects/:ulid/comments');
console.log('// GET    /api/v1/projects/:ulid/comments');
console.log('// DELETE /api/v1/comments/:id');
console.log('');
console.log('// Auth: DID-signed via did-sign/did-pk headers');
console.log('// (same pattern as DPP client)';
console.log('');
console.log('// Configuration:');
console.log('// NEXT_PUBLIC_FEEDBACK_URL = service base URL';`;

const createReview = `// Create a review (1-5 stars)
// POST /api/v1/projects/:ulid/reviews

console.log('await feedbackApi.createReview(');
console.log('  projectUlid,');
console.log('  4,                      // rating 1-5');
console.log('  "Great documentation!"   // optional text');
console.log(');');
console.log('');
console.log('// Returns Review:');
console.log('{');
console.log('  id: "...",');
console.log('  project_ulid: "...",');
console.log('  user_ulid: "...",');
console.log('  rating: 4,');
console.log('  content: "Great documentation!",');
console.log('  created_at: "2026-01-15T...",');
console.log('  updated_at: "2026-01-15T..."');
console.log('}');
console.log('');
console.log('// Only one review per user per project');
console.log('// Creating a second one updates the existing';`;

const summaryDemo = `// Get aggregated review stats
// GET /api/v1/projects/:ulid/reviews/summary

console.log('const summary = await feedbackApi');
console.log('  .getReviewSummary(projectUlid);');
console.log('');
console.log('// Returns ReviewSummary:');
console.log('{');
console.log('  average_rating: 4.2,');
console.log('  total_reviews: 15,');
console.log('  rating_distribution: {');
console.log('    1: 0, 2: 1, 3: 3, 4: 6, 5: 5');
console.log('  }');
console.log('}';`;

const commentDemo = `// Post a comment (optionally threaded)
// POST /api/v1/projects/:ulid/comments

console.log('// Top-level comment:');
console.log('await feedbackApi.createComment(');
console.log('  projectUlid,');
console.log('  "Nice work! What license?"');
console.log(');');
console.log('');
console.log('// Reply to a comment:');
console.log('await feedbackApi.createComment(');
console.log('  projectUlid,');
console.log('  "It is CC-BY-SA 4.0",');
console.log('  parentCommentId    // reply to this');
console.log(');');
console.log('');
console.log('// Returns Comment:');
console.log('{');
console.log('  id: "...",');
console.log('  project_ulid: "...",');
console.log('  user_ulid: "...",');
console.log('  parent_id: null,           // or parent id');
console.log('  content: "...",');
console.log('  attachments: null,         // JSON array');
console.log('  status: "active",');
console.log('  created_at: "...",');
console.log('  updated_at: "..."');
console.log('}';`;
</script>

# Feedback — Reviews & Comments

The Interfacer ecosystem now uses **interfacer-feedback-service** — a dedicated REST API for reviews (1-5 star ratings with text) and threaded comments. This replaces the legacy ActivityPub-based social system for project feedback.

> **Note:** The `WalletClient` and `SocialClient` in the SDK are **legacy retro-compatibility wrappers**. The wallet is still used for point awards on project creation, but social interactions (likes, follows) have been superseded by the feedback service.

## Feedback API (HTTP REST)

<Playground label="API Overview" :code="reviewDemo" />

The feedback service is currently consumed directly in the GUI via `lib/feedback.ts` using a `useFeedbackApi()` React hook. Authentication uses DID-signed headers — the same pattern as the DPP client.

## Endpoints

### Reviews

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/projects/:ulid/reviews` | Signed | Create or update review (1 per user) |
| `GET` | `/api/v1/projects/:ulid/reviews` | Public | List reviews (paginated) |
| `GET` | `.../reviews/summary` | Public | Aggregated stats |
| `GET` | `.../reviews/mine` | Signed | Current user's review |
| `DELETE` | `/api/v1/reviews/:id` | Signed | Delete own review |

### Comments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/projects/:ulid/comments` | Signed | Post comment (reply via `parent_id`) |
| `GET` | `/api/v1/projects/:ulid/comments` | Public | List comments (paginated) |
| `DELETE` | `/api/v1/comments/:id` | Signed | Soft-delete own comment |

## Create a Review

<Playground label="Create Review" :code="createReview" />

Each user can only have **one review per project**. Submitting a second review overwrites the previous one. Ratings are integers 1-5. Content is optional markdown text.

## Review Summary

Fetched separately for header displays:

<Playground label="Summary" :code="summaryDemo" />

## Threaded Comments

Comments support replies via `parent_id`:

<Playground label="Comments" :code="commentDemo" />

The GUI renders comments as threads with indented replies under ReviewCard components. Each Review can have its own CommentThread of replies.

## Pagination

Both reviews and comments support cursor-based pagination:

```ts
// Review pagination
const { reviews } = await api.getReviews(projectUlid, {
  limit: 20,
  cursor: lastReviewTimestamp, // Unix ms
});

// Comment pagination (optionally filtered by parent)
const { comments } = await api.getComments(projectUlid, {
  limit: 50,
  cursor: lastCommentTimestamp,
  parent_id: "top_level_or_parent_id",
});
```

## Authentication

Same DID-signing pattern as the DPP client:

```ts
// Request signing (from lib/feedback.ts):
const signBody = async (body: string) => {
  const eddsaKey = localStorage.getItem("eddsaPrivateKey") || "";
  const data = JSON.stringify({
    gql: Buffer.from(body, "utf8").toString("base64"),
  });
  const keys = JSON.stringify({ keyring: { eddsa: eddsaKey } });

  const { result } = await zencode_exec(signContract, { data, keys });
  const { eddsa_signature } = JSON.parse(result);

  return {
    "did-sign": eddsa_signature,
    "did-pk": publicKey,
  };
};
```

## Wallet Points (Retro-Compat)

The `WalletClient` is still used for point awards on project actions:

```ts
// Award idea points on project creation
await client.wallet.addPoints(userId, Token.Idea, 10);

// Award strength points on contribution
await client.wallet.addPoints(contributorId, Token.Strengths, 50);
```

This may be migrated to the feedback service in the future.

## Next Steps

- [DPP Create & Query](/recipes/dpp-create-and-query) — same DID-signing auth pattern
- [Signing & Crypto](/guides/signing-and-crypto) — EdDSA key derivation and signing
- [Configuration](/guides/configuration) — `NEXT_PUBLIC_FEEDBACK_URL` setup
