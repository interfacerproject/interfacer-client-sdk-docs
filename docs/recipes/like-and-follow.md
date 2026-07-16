---
layout: doc
---

<script setup>
const likeDemo = `// Like a resource using ActivityStreams vocabulary
// Requires: authenticated client with social endpoints configured

console.log('// Like a resource');
console.log('await client.social.likeResource(');
console.log('  "resource_ulid_here"');
console.log(');');
console.log('');
console.log('// Posts to: /inbox/person/{userId}/outbox');
console.log('// Activity payload:');
console.log('{');
console.log('  "@context": "https://www.w3.org/ns/activitystreams",');
console.log('  type: "Like",');
console.log('  actor: ".../inbox/person/<userId>",');
console.log('  object: ".../inbox/economicresource/<resourceId>",');
console.log('  published: "2026-01-15T10:30:00.000Z"');
console.log('}');
console.log('');
console.log('// Request is signed with EdDSA key';`;

const checkDemo = `// Check if the current user liked a resource
// Requires: authenticated client with social endpoints configured

console.log('// Get all likes for current user');
console.log('const likes = await client.social.getLikes();');
console.log('// -> ["resource_id_1", "resource_id_2", ...]');
console.log('');
console.log('// Check a specific resource');
console.log('const isLiked = await client.social.isLiked(');
console.log('  "resource_ulid_here"');
console.log(');');
console.log('// -> true / false');
console.log('');
console.log('// Use for UI toggle state');
console.log('// <button class={isLiked ? "active" : ""}>');
console.log('//   {isLiked ? "❤ Liked" : "♡ Like"}');
console.log('// </button>';`;

const followDemo = `// Follow (watch) a resource for ActivityPub updates
// Requires: authenticated client with social endpoints configured

console.log('// Follow a resource');
console.log('await client.social.followResource(');
console.log('  "resource_ulid_here"');
console.log(');');
console.log('');
console.log('// Activity payload:');
console.log('{');
console.log('  "@context": "https://www.w3.org/ns/activitystreams",');
console.log('  type: "Follow",');
console.log('  actor: ".../inbox/person/<userId>",');
console.log('  object: ".../inbox/economicresource/<resourceId>",');
console.log('  published: "2026-01-15T10:30:00.000Z"');
console.log('}');
console.log('');
console.log('// Check following status');
console.log('const isFollowing = await client.social');
console.log('  .isFollowing("resource_ulid_here");');
console.log('');
console.log('// Get all resources the user follows');
console.log('const following = await client.social.getFollowing();');
console.log('');
console.log('// Get followers of a resource');
console.log('const followers = await client.social');
console.log('  .getFollowers("resource_ulid_here");');
console.log('// -> ["person_id_1", "person_id_2", ...]';`;
</script>

# Like & Follow

::: warning Legacy Retro-Compatibility
The ActivityPub-based social system (likes, follows) is **legacy** and not actively used in
the current Interfacer GUI. Project feedback now uses the dedicated
[Feedback & Reviews](/guides/feedback-reviews) REST API for star ratings and threaded comments.
This module is kept for backward compatibility.
:::

Social interactions use the ActivityStreams protocol via signed REST endpoints. All operations are accessed through `client.social`.

## Like a Resource

Posts a `Like` activity to the ActivityPub outbox:

<Playground label="Like" :code="likeDemo" />

## Check Like Status

Query the like state for UI display:

<Playground label="Check Likes" :code="checkDemo" />

## Follow a Resource

Following sends ActivityPub updates when the resource changes:

<Playground label="Follow" :code="followDemo" />

## Full Social API

| Method | Returns | Description |
|--------|---------|-------------|
| `likeResource(id)` | `void` | Post a Like activity |
| `followResource(id)` | `void` | Post a Follow activity |
| `getLikes()` | `string[]` | All resource IDs liked by current user |
| `isLiked(id)` | `boolean` | Check if current user liked a resource |
| `getFollowers(id)` | `string[]` | Person IDs following a resource |
| `getFollowing()` | `string[]` | Resource IDs the current user follows |
| `isFollowing(id)` | `boolean` | Check if current user follows a resource |

## Configuration

Social endpoints are derived from `proxyUrl`:

```ts
const config = createConfig({
  proxyUrl: "https://proxy.dpp-dev.ddns.dyne.org",
});
// config.social.personBase → .../inbox/person
// config.social.economicResourceBase → .../inbox/economicresource
```

The URLs follow the ActivityPub spec:
- Person: `{personBase}/{personId}` — user profiles and outboxes
- EconomicResource: `{erBase}/{resourceId}` — resource endpoints and followers

## Endpoint Mapping

| Operation | HTTP | URL |
|-----------|------|-----|
| Like/Follow (outbox) | POST | `{personBase}/{userId}/outbox` |
| Get likes | GET | `{personBase}/{userId}/liked` |
| Get followers | GET | `{erBase}/{resourceId}/follower` |
| Get following | GET | `{personBase}/{userId}/following` |

## Error Handling

```ts
try {
  await client.social.likeResource(resourceId);
} catch (err) {
  // err.message: "ActivityPub post failed: ..."
  // Common causes: social endpoints not configured,
  //                not authenticated (missing keys),
  //                resource doesn't exist
}
```

## Next Steps

- [Create Resource](/recipes/create-resource) — resources to like and follow
- [Send & Read Messages](/recipes/send-message) — notifying resource owners of interactions
- [API: SocialClient](/api/classes/SocialClient) — full method reference
