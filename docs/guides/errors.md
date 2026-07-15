# Errors

## Error Pattern

All SDK methods throw errors with descriptive messages. Wrap calls in try/catch:

```ts
try {
  await client.resources.createProject({ ... });
} catch (err) {
  console.error("Failed:", err.message);
}
```

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Not authenticated` | No keys in storage | Run auth flow first |
| `zenflowsUrl not configured` | Missing config | Check `InterfacerConfig` |
| `HMAC not returned` | Email not found / server issue | Check sandbox status |
| `Registration failed` | Duplicate email | Use unique email |
| `dppUrl not configured` | Missing DPP endpoint | Add to config |
| `inbox.send URL not configured` | Missing inbox config | Add inbox endpoints |

## GraphQL Errors

```ts
const res = await client.graphql.request(query, variables);

if (res.errors?.length) {
  // Server returned GraphQL-level errors
  for (const err of res.errors) {
    console.error(err.message);
  }
}
```

## HTTP Errors

The `GraphQLClient` wraps HTTP errors:

```ts
if (!res.ok) {
  return {
    errors: [{ message: `HTTP ${res.status}: ${res.statusText}` }],
  };
}
```

## REST Errors

DPP, Inbox, and Wallet clients throw on non-2xx responses:

```ts
if (!res.ok) {
  let errMsg = res.statusText;
  try {
    const err = await res.json();
    errMsg = err.error || errMsg;
  } catch {}
  throw new Error(`DPP POST /dpp failed: ${errMsg}`);
}
```

## Retry Strategy

For network-level failures, wrap in retry logic:

```ts
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error("Unreachable");
}
```

## Authentication Failures

If signing is enabled but keys are missing:

```ts
// The client gracefully degrades — warning is logged, request proceeds unsigned
console.warn("[interfacer-client] GraphQL signing failed:", err);
```

## Best Practices

1. **Always check `res.errors`** after GraphQL requests
2. **Wrap async operations** in try/catch
3. **Check `isAuthenticated()`** before authenticated operations
4. **Validate config** before creating the client
5. **Log errors** to help debugging in sandbox environments
