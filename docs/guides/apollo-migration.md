---
layout: doc
---

<script setup>
const queryDemo = `import { useSdkQuery } from './hooks/useSdkQuery';
import { useAuth } from './hooks/useAuth';

// Before (Apollo):
// const { data, loading, error } = useQuery(GET_MACHINES);

// After (SDK):
const { data, loading, error, refetch } = useSdkQuery(
  \`query ($resourceSpecId: ID!) {
    economicResources(resourceSpecification: $resourceSpecId) {
      edges { node { id name note } }
    }
  }\`,
  { variables: { resourceSpecId: specId } }
);

console.log('API matches Apollo exactly:');
console.log('  data, loading, error, refetch');
console.log('  skip, variables, fetchMore');
console.log('  All work as drop-in replacements';`;

const mutationDemo = `import { useSdkMutation } from './hooks/useSdkQuery';
import { useAuth } from './hooks/useAuth';

// Before (Apollo):
// const [createProject, { loading, error }] = useMutation(CREATE_PROJECT);

// After (SDK):
const [createProject, { loading, error }] = useSdkMutation(
  \`mutation CreateProject($name: String!) {
    createEconomicEvent(...) { ... }
  }\`
);

const result = await createProject({
  variables: { name: 'My Project' }
});

console.log('Exact same API:');
console.log('mutate({ variables }) -> { data, errors }');`;
</script>

# Apollo Migration

If you're migrating from Apollo Client to the `@dyne/interfacer-client` SDK, this guide covers drop-in replacement hooks and the approach used in the Interfacer GUI.

## Why Migrate?

The Interfacer GUI originally used Apollo Client with a custom GraphQL endpoint. The SDK replaces Apollo entirely:

- **No Apollo dependency** — lighter bundles, fewer dependencies
- **Built-in signing** — GraphQL mutations auto-signed with EdDSA
- **Shared client** — single `InterfacerClient` used by all hooks
- **Type-safe sub-clients** — `client.resources.createProject()` vs raw GQL

## `useSdkQuery` — Drop-in for Apollo's `useQuery`

```ts
// Before (Apollo)
const { data, loading, error, refetch } = useQuery(GET_PROJECTS, {
  variables: { limit: 10 }
});

// After (SDK)
const { data, loading, error, refetch } = useSdkQuery(GET_PROJECTS, {
  variables: { limit: 10 }
});
```

<!-- <Playground label="useSdkQuery" :code="queryDemo" /> -->

### API Compatibility

| Apollo `useQuery` | `useSdkQuery` |
|---|---|
| `data` | ✅ same |
| `loading` | ✅ same |
| `error` | ✅ same |
| `refetch()` | ✅ same |
| `refetch(newVars?)` | ✅ same |
| `variables` | ✅ same |
| `skip` | ✅ `{ skip: true }` |
| `fetchMore({ variables, updateQuery })` | ✅ same |
| `pollInterval` | ❌ not supported |
| `subscribeToMore` | ❌ not supported |

## `useSdkMutation` — Drop-in for Apollo's `useMutation`

```ts
// Before (Apollo)
const [createProject, { loading, error }] = useMutation(CREATE_PROJECT);

await createProject({ variables: { name: "Widget" } });

// After (SDK)
const [createProject, { loading, error }] = useSdkMutation(CREATE_PROJECT);

await createProject({ variables: { name: "Widget" } });
```

<!-- <Playground label="useSdkMutation" :code="mutationDemo" /> -->

### API Compatibility

| Apollo `useMutation` | `useSdkMutation` |
|---|---|
| `mutate({ variables })` | ✅ same |
| `loading` | ✅ same |
| `error` | ✅ same |
| `onCompleted` | ✅ supported |
| `onError` | ✅ supported |
| `update` / `refetchQueries` | ❌ not supported |

## ApolloProvider (No-Op)

The SDK provides a compatible `ApolloProvider` that renders children directly:

```ts
import { ApolloProvider } from "@dyne/interfacer-client/lib/apollo-compat";

// Works as a no-op — keeps existing component trees compiling
<ApplloProvider>
  <App />
</ApolloProvider>
```

## Direct SDK Usage (Preferred)

Where possible, prefer the SDK's sub-clients over raw GraphQL:

```ts
// Instead of raw GraphQL:
const result = await createProject({
  variables: { name: "Widget", specId: "01J..." }
});

// Use the typed SDK method:
const project = await client.resources.createProject({
  projectType: ProjectType.PRODUCT,
  name: "Widget",
});
```

## Migration Patterns

### Pattern 1: Keep GraphQL, replace Apollo

Minimal change — keep all your GraphQL query strings and replace Apollo hooks with `useSdkQuery`/`useSdkMutation`. All your existing query/mutation strings continue to work.

### Pattern 2: Migrate to sub-clients

Replace GraphQL queries with typed SDK methods. Example:

```ts
// Before
const { data } = useSdkQuery(GET_MACHINES_V1, {
  variables: { resourceSpecId: "01J..." }
});

// After
const machines = await client.resources.getMachines();
```

This removes the GraphQL query string entirely and gives you type-safe return values.

### Pattern 3: Mixed

Keep complex/nested queries as GraphQL, migrate simple CRUD to sub-clients:

```ts
// Complex listing query — keep as GraphQL
const { data: projects } = useSdkQuery(PROJECTS_WITH_RELATIONS, {
  variables: { filter: projectFilter }
});

// Simple mutation — use SDK
await client.social.likeResource(resourceId);
```

## gql Tag

The `gql` tag function is re-exported from the compat shim. It simply concatenates template strings (no AST parsing):

```ts
import { gql } from "@dyne/interfacer-client/lib/apollo-compat";

const query = gql`
  query GetProject($id: ID!) {
    economicResource(id: $id) { id name }
  }
`;
```

## Configuration

All SDK methods share the same `InterfacerClient` instance. Access it through your auth context:

```ts
import { useAuth } from "./hooks/useAuth";

function MyComponent() {
  const { client } = useAuth();

  // Use sub-clients directly
  const doThing = async () => {
    await client.resources.createProject({ ... });
  };
}
```

## Next Steps

- [Client Guide](/guides/client) — facade architecture and sub-client access
- [Configuration](/guides/configuration) — client setup and endpoints
- [Create Resource](/recipes/create-resource) — typed project creation
