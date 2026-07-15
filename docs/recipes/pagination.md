# Pagination

Cursor-based pagination for resource lists.

## Basic Usage

```ts
const page = await client.resources.listResources(
  {},                // filter
  { first: 10 }      // pagination
);

// page.edges: Array<{ cursor, node }>
// page.pageInfo: { startCursor, endCursor, hasPreviousPage, hasNextPage, totalCount, pageLimit }
```

## Forward Pagination

```ts
let cursor: string | undefined;

do {
  const page = await client.resources.listResources(
    {},
    { first: 10, after: cursor }
  );

  for (const { node } of page.edges) {
    console.log(node.id);
  }

  cursor = page.pageInfo.hasNextPage
    ? page.pageInfo.endCursor
    : undefined;
} while (cursor);
```

## Backward Pagination

```ts
const page = await client.resources.listResources(
  {},
  { last: 10, before: cursor }
);
```

## Project Listing

```ts
const projects = await client.resources.getProjects(
  { status: "PUBLISHED" },   // filter
  { first: 20 }               // pagination
);
```

## DPP Listing

```ts
const dpps = await client.dpp.listDpps({
  status: "active",
  limit: 10,
  offset: 0,
  sortBy: "createdAt",
  sortOrder: "desc",
});
```

## PageInfo

```ts
interface PageInfo {
  startCursor?: string;
  endCursor?: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalCount: number;
  pageLimit: number;
}
```

## Tips

- `first` + `after` = forward pagination
- `last` + `before` = backward pagination
- `totalCount` gives the total number of items matching the filter
- Use `endCursor` of the last page to fetch the next page
