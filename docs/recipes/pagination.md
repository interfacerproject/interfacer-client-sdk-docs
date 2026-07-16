---
layout: doc
---

<script setup>
const paginationDemo = `// Cursor-based pagination demo
const pages = [
  { cursor: 'a1', items: ['Project Alpha', 'Project Beta', 'Project Gamma'] },
  { cursor: 'a2', items: ['Project Delta', 'Project Epsilon'] },
  { cursor: null, items: ['Project Zeta'] },
];

var cursor = undefined;
var pageNum = 1;

function fetchPage(after) {
  var idx = after ? pages.findIndex(function(p) { return p.cursor === after; }) + 1 : 0;
  return pages[idx] || { cursor: null, items: [] };
}

do {
  var page = fetchPage(cursor);
  console.log('--- Page ' + pageNum + ' ---');
  page.items.forEach(function(item) { console.log('  ' + item); });

  cursor = page.cursor;
  pageNum++;

  if (!cursor) {
    console.log('\\nNo more pages. Total: ' + pages.reduce(function(s,p){ return s + p.items.length; }, 0) + ' items');
  }
} while (cursor);`;
</script>

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

<Playground label="Pagination Loop" :code="paginationDemo" />

## Backward Pagination

```ts
const page = await client.resources.listResources(
  {},
  { last: 10, before: cursor }
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
