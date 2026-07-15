# Responses

## GraphQL Response Shape

```ts
interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}
```

Always check for errors:

```ts
const res = await client.graphql.request(query, variables);
if (res.errors?.length) {
  throw new Error(res.errors[0].message);
}
const result = res.data;
```

## Resource Types

### Project

```ts
interface Project {
  id: string;           // ULID
  name: string;
  description: string;
  type: ProjectType;    // DESIGN | PRODUCT | SERVICE | MACHINE | DPP
  createdAt: string;
  repo?: string;
  primaryLicense?: string;
  owner: { id, name, image? };
  location?: Location;
  isRemote: boolean;
  tags: string[];
  licenses: License[];
  contributors: Contributor[];
  relations: Array<{ id, name }>;
  images: ImageRef[];
  models: ModelFile[];
  machines: MachineRef[];
  materials: MaterialRef[];
  likes?: number;
  followers?: number;
}
```

### UserProfile

```ts
interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  isVerified: boolean;
  note?: string;
  image?: string;
  location?: Location;
}
```

### InboxMessage

```ts
interface InboxMessage {
  id: number;
  sender: string;
  content: {
    data: string;       // ISO date
    message: unknown;
    subject: string;
  };
  read: boolean;
}
```

### DppDocument

```ts
interface DppDocument {
  id: string;
  status: "draft" | "active" | "archived";
  createdAt: string;
  updatedAt: string;
  productOverview?: { name, description, category, manufacturer };
  sustainability?: Record<string, unknown>;
  supplyChainHistory?: Array<Record<string, unknown>>;
  compliance?: Record<string, boolean>;
  attachments?: Attachment[];
}
```

## Pagination

```ts
interface PageInfo {
  startCursor?: string;
  endCursor?: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalCount: number;
  pageLimit: number;
}

interface PaginatedResult<T> {
  edges: Array<{ cursor: string; node: T }>;
  pageInfo: PageInfo;
}
```
