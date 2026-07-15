---
layout: page
---

<script setup>
const sdkDemo = `// SDK FeedbackClient — reviews & comments via client.feedback
import { InterfacerClient, createConfig } from '@dyne/interfacer-client';

const client = new InterfacerClient(createConfig({
  proxyUrl: 'https://proxy.dpp-dev.ddns.dyne.org',
  feedbackUrl: process.env.NEXT_PUBLIC_FEEDBACK_URL,
}));

// All methods available through client.feedback:
console.log('// Reviews:');
console.log('// client.feedback.createReview(projectUlid, rating, content)');
console.log('// client.feedback.getReviews(projectUlid, params)');
console.log('// client.feedback.getReviewSummary(projectUlid)');
console.log('// client.feedback.getUserReview(projectUlid)');
console.log('// client.feedback.deleteReview(reviewId)');
console.log('');
console.log('// Comments:');
console.log('// client.feedback.createComment(projectUlid, content, parentId)');
console.log('// client.feedback.getComments(projectUlid, params)');
console.log('// client.feedback.deleteComment(commentId)';
console.log('');
console.log('// Auth: DID-signed (did-sign + did-pk headers)');
console.log('// Same pattern as client.dpp — no manual signing needed';`;

const createReview = `// Create a review (1-5 stars, one per user per project)
console.log('const review = await client.feedback');
console.log('  .createReview(');
console.log('    projectUlid,');
console.log('    4,                      // rating 1-5');
console.log('    "Great documentation!"   // optional text');
console.log('  );');
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
console.log('}';
console.log('');
console.log('// Each user can only have one review per project.');
console.log('// Creating a second one updates the existing.';`;

const commentDemo = `// Post a comment (threaded via parentId)
console.log('// Top-level comment:');
console.log('const comment = await client.feedback');
console.log('  .createComment(');
console.log('    projectUlid,');
console.log('    "Nice work! What license?"');
console.log('  );');
console.log('');
console.log('// Reply to a comment:');
console.log('const reply = await client.feedback');
console.log('  .createComment(');
console.log('    projectUlid,');
console.log('    "CC-BY-SA 4.0",');
console.log('    parentCommentId    // reply to this');
console.log('  );';
console.log('');
console.log('// Fetch comment thread:');
console.log('const { comments } = await client.feedback');
console.log('  .getComments(projectUlid, {');
console.log('    parent_id: reviewId  // fetch replies');
console.log('  });';`;
</script>

# Feedback — Reviews & Comments

The `client.feedback` module provides access to the **interfacer-feedback-service** — a dedicated REST API for reviews (1-5 star ratings with text) and threaded comments. It replaces the legacy ActivityPub-based social system for project feedback.

> The `FeedbackClient` was added in SDK v0.4.0. It uses the same DID-signing pattern as `DppClient`.

## Configuration

```ts
const client = new InterfacerClient(
  createConfig({
    proxyUrl: "https://proxy.dpp-dev.ddns.dyne.org",
    feedbackUrl: process.env.NEXT_PUBLIC_FEEDBACK_URL,
  })
);
```

The `feedbackUrl` is **not derived from `proxyUrl`** — pass it explicitly.

## API Overview

<Playground label="SDK API" :code="sdkDemo" />

## Reviews

### Create a Review

<Playground label="Create Review" :code="createReview" />

Each user can only have **one review per project**. Submitting a second one updates the existing. Ratings are integers 1-5.

### Read Reviews

```ts
// All reviews (paginated)
const { reviews } = await client.feedback.getReviews(projectUlid, {
  limit: 20,
  cursor: lastTimestamp,
});

// Aggregated statistics
const summary = await client.feedback.getReviewSummary(projectUlid);
// { average_rating: 4.2, total_reviews: 15, rating_distribution: { ... } }

// Current user's review
const { review } = await client.feedback.getUserReview(projectUlid);
// review is null if user hasn't reviewed yet

// Delete own review
await client.feedback.deleteReview(reviewId);
```

## Comments

<Playground label="Comments" :code="commentDemo" />

Comments support threading via `parent_id`. Set it to a review or comment ID for replies.

```ts
// Paginated comments (optionally filtered by parent)
const { comments } = await client.feedback.getComments(projectUlid, {
  limit: 50,
  cursor: lastTimestamp,
  parent_id: "specific_parent", // optional
});

// Soft-delete (only author can delete)
await client.feedback.deleteComment(commentId);
```

## React Hook (from interfacer-gui)

```ts
import useFeedbackApi from "lib/feedback";

function MyComponent() {
  const api = useFeedbackApi();

  // Same API as client.feedback, but accessed through auth context
  const reviews = await api.getReviews(projectUlid);
}
```

The `useFeedbackApi` hook wraps `client.feedback` with the same API shape — drop-in replacement for the old `lib/feedback.ts`.

## Endpoints

| Method | Path | Auth | SDK method |
|--------|------|------|------------|
| `POST` | `.../reviews` | Signed | `createReview` |
| `GET` | `.../reviews` | Public | `getReviews` |
| `GET` | `.../reviews/summary` | Public | `getReviewSummary` |
| `GET` | `.../reviews/mine` | Signed | `getUserReview` |
| `DELETE` | `/api/v1/reviews/:id` | Signed | `deleteReview` |
| `POST` | `.../comments` | Signed | `createComment` |
| `GET` | `.../comments` | Public | `getComments` |
| `DELETE` | `/api/v1/comments/:id` | Signed | `deleteComment` |

## Types

```ts
interface Review {
  id: string;
  project_ulid: string;
  user_ulid: string;
  rating: number;        // 1-5
  content?: string | null;
  created_at: string;
  updated_at: string;
}

interface Comment {
  id: string;
  project_ulid: string;
  user_ulid: string;
  parent_id?: string | null;  // threaded replies
  content: string;
  status: string;             // "active" | "deleted"
  created_at: string;
  updated_at: string;
}

interface ReviewSummary {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<number, number>;
}
```

## Next Steps

- [DPP Create & Query](/recipes/dpp-create-and-query) — same DID-signing auth pattern
- [Configuration](/guides/configuration) — `feedbackUrl` setup
- [API: DppClient](/api/classes/DppClient) — same DID-signing auth pattern
