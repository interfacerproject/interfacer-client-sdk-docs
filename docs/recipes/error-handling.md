# Error Handling

Patterns and strategies for handling errors across the SDK.

## Always Check for Errors

```ts
const res = await client.graphql.request(query, variables);

if (res.errors?.length) {
  console.error("GraphQL errors:", res.errors);
  return;
}

// Safe to use res.data
```

## Wrap Async Operations

```ts
async function safeCreateProject(params: CreateProjectParams) {
  if (!client.isAuthenticated()) {
    throw new Error("Must authenticate first");
  }

  try {
    return await client.resources.createProject(params);
  } catch (err) {
    if (err.message.includes("spec ID not found")) {
      // Fallback: provide specs in config
      client.config.specs = { design: "known-spec-id" };
      return client.resources.createProject(params);
    }
    throw err;
  }
}
```

## Retry with Backoff

```ts
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error("Unreachable");
}
```

## Timeout Wrapper

```ts
async function withTimeout<T>(
  promise: Promise<T>,
  ms: number
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}
```

## Authentication Recovery

```ts
async function ensureAuth(client: InterfacerClient) {
  if (client.isAuthenticated()) return;

  const seed = client.store.getItem("seed");
  const email = client.store.getItem("authEmail");

  if (seed && email) {
    const hmac = await withTimeout(
      client.auth.requestHmac(email, false),
      10000
    );
    await client.auth.recreateKeys(seed, hmac);
    await client.auth.login({ email });
  } else {
    throw new Error("No stored credentials. Run full auth flow.");
  }
}
```

## Logging

```ts
// Enable verbose logging for debugging
const originalRequest = client.graphql.request.bind(client.graphql);
client.graphql.request = async (query, vars, headers) => {
  console.debug("[GraphQL]", query.substring(0, 50) + "...");
  const result = await originalRequest(query, vars, headers);
  if (result.errors?.length) {
    console.warn("[GraphQL errors]", result.errors);
  }
  return result;
};
```

## Best Practices

1. **Auth first** — `isAuthenticated()` before any mutation
2. **Config validation** — ensure required URLs are set
3. **Graceful degradation** — handle optional services (OSH, DPP) being unavailable
4. **Re-authenticate** — keys expire; keep seed for re-derivation
5. **Rate limiting** — add delays between rapid mutations
