---
layout: doc
---

<script setup>
const retryDemo = `// Retry with exponential backoff
async function withRetry(fn, retries, baseDelay) {
  retries = retries || 3;
  baseDelay = baseDelay || 1000;
  
  for (var attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      var delay = baseDelay * Math.pow(2, attempt);
      console.warn('Attempt ' + (attempt + 1) + ' failed, retrying in ' + delay + 'ms...');
      await new Promise(function(r) { setTimeout(r, delay); });
    }
  }
}

// Simulate a flaky API that fails twice then succeeds
var callCount = 0;
function flakyApi() {
  callCount++;
  if (callCount < 3) {
    return Promise.reject(new Error('Network error (attempt ' + callCount + ')'));
  }
  return Promise.resolve({ status: 'ok', data: [1, 2, 3] });
}

withRetry(flakyApi, 3, 500)
  .then(function(result) {
    console.log('\\nSuccess! Result:', JSON.stringify(result));
    console.log('Total API calls:', callCount);
  })
  .catch(function(err) {
    console.error('All retries exhausted:', err.message);
  });`;

const timeoutDemo = `// Timeout wrapper
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise(function(_, reject) {
      setTimeout(function() {
        reject(new Error('Timeout after ' + ms + 'ms'));
      }, ms);
    })
  ]);
}

// Fast request — completes before timeout
var fast = new Promise(function(resolve) {
  setTimeout(function() { resolve('Fast response'); }, 300);
});

withTimeout(fast, 1000)
  .then(function(r) { console.log('Fast:', r); })
  .catch(function(e) { console.error(e.message); });

// Slow request — hits the timeout
var slow = new Promise(function(resolve) {
  setTimeout(function() { resolve('Too late'); }, 2000);
});

withTimeout(slow, 1000)
  .then(function(r) { console.log(r); })
  .catch(function(e) { console.error('Slow:', e.message); });`;
</script>

# Error Handling

Patterns and strategies for handling errors across the SDK.

## Always Check for Errors

```ts
const res = await client.graphql.request(query, variables);

if (res.errors?.length) {
  console.error("GraphQL errors:", res.errors);
  return;
}
```

## Retry with Backoff

<!-- <Playground label="Retry Logic" :code="retryDemo" /> -->

## Timeout Wrapper

<!-- <Playground label="Timeout" :code="timeoutDemo" /> -->

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
      client.config.specs = { design: "known-spec-id" };
      return client.resources.createProject(params);
    }
    throw err;
  }
}
```

## Best Practices

1. **Auth first** — `isAuthenticated()` before any mutation
2. **Config validation** — ensure required URLs are set
3. **Graceful degradation** — handle optional services being unavailable
4. **Re-authenticate** — keys expire; keep seed for re-derivation
5. **Rate limiting** — add delays between rapid mutations
