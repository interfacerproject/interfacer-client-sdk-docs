---
layout: doc
---

<script setup>
const balanceDemo = `// Check idea and strength point balances
// Requires: authenticated client with walletUrl configured

console.log('import { Token } from "@dyne/interfacer-client";');
console.log('');
console.log('// Get current balance');
console.log('const ideaBalance = await client.wallet');
console.log('  .getBalance(agentId, Token.Idea);');
console.log('// -> 42.50');
console.log('');
console.log('const strengthBalance = await client.wallet');
console.log('  .getBalance(agentId, Token.Strengths);');
console.log('// -> 15.00');
console.log('');
console.log('// Token enum:');
console.log('// Token.Idea      = "idea"');
console.log('// Token.Strengths = "strengths"');
console.log('');
console.log('// Balance at a specific timestamp');
console.log('const pastBalance = await client.wallet');
console.log('  .getBalanceAt(agentId, Token.Idea,');
console.log('    Date.now() - 7 * 24 * 60 * 60 * 1000');
console.log('  );');`;

const addDemo = `// Award points to a user
// Requires: authenticated client with walletUrl configured

console.log('import { Token } from "@dyne/interfacer-client";');
console.log('');
console.log('// Award idea points');
console.log('await client.wallet.addPoints(');
console.log('  agentId,');
console.log('  Token.Idea,');
console.log('  1  // amount');
console.log(');');
console.log('');
console.log('// Award strength points');
console.log('await client.wallet.addPoints(');
console.log('  agentId,');
console.log('  Token.Strengths,');
console.log('  1');
console.log(');');
console.log('');
console.log('// Request is signed with the authenticated user' + "'" + 's keys');
console.log('// Amount defaults to 1 if omitted';`;

const trendDemo = `// Calculate point trend over a period
// Requires: authenticated client with walletUrl configured

console.log('import { Token } from "@dyne/interfacer-client";');
console.log('');
console.log('// Trend since start of current cycle');
console.log('const cycleStartMs = Date.parse("2026-01-01");');
console.log('const trend = await client.wallet.getTrend(');
console.log('  agentId,');
console.log('  Token.Idea,');
console.log('  cycleStartMs');
console.log(');');
console.log('// -> 25.5  (+25.5% since cycle start)');
console.log('');
console.log('// Trend formula:');
console.log('// ((currentBalance - periodStartBalance)');
console.log('//   / periodStartBalance) * 100');
console.log('');
console.log('// Returns 0 if periodStartBalance is 0';`;

const pointsDemo = `// Points distribution constants (from Interfacer GUI)

console.log('// IDEA POINTS');
console.log('//');
console.log('// OnCreate:         10  (create a project)');
console.log('// OnCite:           2   (cite another resource)');
console.log('// OnContributions:  2   (add a contributor)');
console.log('// OnReview:         1   (leave a review)');
console.log('//');
console.log('// STRENGTH POINTS');
console.log('//');
console.log('// OnCreate:         50  (create a project)');
console.log('// OnContributions:  10  (contribute to a project)');
console.log('// OnReview:         5   (receive a review)');
console.log('//');
console.log('// Points are integer values stored as cents:');
console.log('// amount / 100 = display value';`;
</script>

# Wallet Points

::: warning Legacy Retro-Compatibility
Wallet points are **still used** for awarding Idea and Strength tokens on project creation
and contributions. However, the new **reviews, ratings, and comments** system uses the
separate [Feedback & Reviews](/guides/feedback-reviews) REST API instead.
:::

The wallet system tracks two token types: **Idea Points** for reputation and **Strength Points** for economic value. All wallet operations are signed and require the `walletUrl` endpoint.

## Token Types

| Token | Enum | Purpose |
|-------|------|---------|
| Idea Points | `Token.Idea` | Reputation — earned by creating, citing, contributing, reviewing |
| Strength Points | `Token.Strengths` | Economic value — earned by producing, contributing, receiving reviews |

## Check Balance

<Playground label="Balance" :code="balanceDemo" />

## Award Points

<Playground label="Award" :code="addDemo" />

The `addPoints` call is signed with the authenticated user's EdDSA key. The server validates the signature and records the transaction on the wallet ledger.

## Calculate Trend

Track point growth over a period (cycle, month, week):

<Playground label="Trend" :code="trendDemo" />

## Points Distribution (from Interfacer GUI)

<Playground label="Distribution" :code="pointsDemo" />

## Real Usage Pattern (from Interfacer GUI)

When creating a project, points are awarded after successful creation:

```ts
const project = await client.resources.createProject({ ... });

// Award points to the creator
await client.wallet.addPoints(userId, Token.Idea, IdeaPoints.OnCreate);
await client.wallet.addPoints(userId, Token.Strengths, StrengthsPoints.OnCreate);

// Award points to contributors
for (const contributor of contributors) {
  await client.wallet.addPoints(contributor, Token.Strengths, StrengthsPoints.OnContributions);
}
```

## Configuration

The wallet service URL is derived from `proxyUrl`:

```ts
const config = createConfig({
  proxyUrl: "https://proxy.dpp-dev.ddns.dyne.org",
});
// config.walletUrl === "https://proxy.dpp-dev.ddns.dyne.org/wallet/token"
```

Add wallet cycle configuration for trend calculations:

```ts
const config = createConfig({
  proxyUrl: "https://proxy.dpp-dev.ddns.dyne.org",
  walletCycle: {
    startDate: "2026-01-01",
    cycleLength: 30, // days
  },
});
```

## Error Handling

```ts
try {
  await client.wallet.addPoints(agentId, Token.Idea, 1);
} catch (err) {
  // err.message: "Wallet addPoints failed: ..."
  // Common causes: walletUrl not configured, not authenticated,
  //                agentId doesn't exist, network error
}
```

## Next Steps

- [Configuration](/guides/configuration) — wallet endpoint setup
- [Send & Read Messages](/recipes/send-message) — notifying users of point awards
- [API: WalletClient](/api/classes/WalletClient) — full method reference
