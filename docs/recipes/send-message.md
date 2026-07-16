---
layout: doc
---

<script setup>
const sendDemo = `// Send a message to another user
// Requires: authenticated client with inbox endpoints configured

console.log('// Notify a user they were cited');
console.log('const notification = {');
console.log('  originalResourceID: "01J...",');
console.log('  originalResourceName: "Smart Sensor v2",');
console.log('  proposalID: "01J...",');
console.log('  ownerName: "Alice",');
console.log('  proposerName: "Bob",');
console.log('  text: "Your design was cited in a new product"');
console.log('};');
console.log('');
console.log('await client.inbox.sendMessage(');
console.log('  notification,');
console.log('  ["recipient_id_here"],');
console.log('  "PROJECT_CITED"    // subject');
console.log(');');
console.log('');
console.log('// The message is signed with the authenticated user\\'s keys');`;

const readDemo = `// Read inbox messages
// Requires: authenticated client with inbox endpoints configured

console.log('// All messages (sorted by date, newest first)');
console.log('const messages = await client.inbox.getMessages();');
console.log('');
console.log('// Only unread messages');
console.log('const unread = await client.inbox.getMessages(true);');
console.log('');
console.log('// Message structure:');
console.log('{');
console.log('  id: 42,');
console.log('  sender: "user_ulid",');
console.log('  content: {');
console.log('    data: "2026-01-15T10:30:00.000Z",');
console.log('    message: { ... },      // the notification object');
console.log('    subject: "PROJECT_CITED"');
console.log('  },');
console.log('  read: false');
console.log('}');`;

const unreadDemo = `// Notification badge pattern
// Requires: authenticated client with inbox endpoints configured

console.log('// Get unread count for notification badge');
console.log('const count = await client.inbox.getUnreadCount();');
console.log('// -> 3');
console.log('');
console.log('// Mark a message as read when user opens it');
console.log('await client.inbox.markRead(messageId);');
console.log('');
console.log('// In the Interfacer GUI, these are polled:');
console.log('// useSWR to fetch getUnreadCount every N seconds');
console.log('// for the notification bell badge');`;
</script>

# Send & Read Messages

The inbox system handles user-to-user notifications and messaging via signed REST endpoints. Common uses include notifying project owners of citations, contributions, and proposals.

## Send a Message

Messages are signed JSON payloads sent to one or more receivers:

<Playground label="Send" :code="sendDemo" />

The `message` parameter can be any serializable object — the Interfacer GUI defines specific notification types like `ProposalNotification`, `AddedAsContributorNotification`, etc.

## Read Messages

Messages are returned sorted by date (newest first):

<Playground label="Read" :code="readDemo" />

## Unread Count & Mark Read

For notification badges:

<Playground label="Unread" :code="unreadDemo" />

## Notification Types (from Interfacer GUI)

The GUI uses these subject constants for semantic notifications:

| Subject | When |
|---------|------|
| `PROJECT_CITED` | Your resource was cited in a new project |
| `PROPOSAL_RECEIVED` | Someone proposed a contribution to your resource |
| `PROPOSAL_ACCEPTED` | Your contribution proposal was accepted |
| `ADDED_AS_CONTRIBUTOR` | You were added as a contributor to a project |
| `NEW_REVIEW` | Someone left a review on your project |

### Example Notification Objects

**Project Cited:**
```ts
interface ProposalNotification {
  originalResourceID: string;
  originalResourceName: string;
  proposalID: string;
  ownerName: string;
  proposerName: string;
  text: string;
}
```

**Added as Contributor:**
```ts
interface AddedAsContributorNotification {
  projectOwnerId: string;
  projectOwnerName: string;
  resourceName: string;
  resourceID: string;
  text: string;
}
```

## Polling Pattern

In the Interfacer GUI, unread counts are polled with SWR:

```ts
const { data: unread } = useSWR(
  ["inbox-unread-count", user.ulid],
  async () => client.inbox.getUnreadCount(),
  { refreshInterval: 10_000 }
);
```

## Error Handling

All inbox operations are signed — ensure authentication before use:

```ts
if (!client.isAuthenticated()) throw new Error("Login first");

try {
  await client.inbox.sendMessage(msg, receivers, subject);
} catch (err) {
  // Check inbox endpoint config, auth status, network
}
```

## Next Steps

- [Configuration](/guides/configuration) — inbox endpoint setup
- [API: InboxClient](/api/classes/InboxClient) — full method reference
