---
layout: doc
---

<script setup>
const createDemo = `// Create a Digital Product Passport
// Requires: authenticated client with dppUrl configured

console.log('const dpp = await client.dpp.createDpp({');
console.log('  productId: "01J...",');
console.log('  status: "draft",');
console.log('  productOverview: {');
console.log('    name: "Smart Sensor v2",');
console.log('    description: "Open source environmental monitor",');
console.log('    category: "Electronics",');
console.log('  },');
console.log('  environmental: {');
console.log('    recyclabilityPct: 85,');
console.log('    powerRequirementW: 15,');
console.log('    energyKwh: 30,');
console.log('    co2Kg: 2.5,');
console.log('    repairability: true,');
console.log('  },');
console.log('  powerCompatibility: ["USB-C"],');
console.log('  replicability: "High",');
console.log('});');
console.log('');
console.log('// Returns: { id, productId, status, createdAt }');
console.log('// dpp.id -> ULID used for createDppResource';`;

const queryDemo = `// Query and filter DPPs
// Requires: authenticated client with dppUrl configured

console.log('// List all DPPs');
console.log('const result = await client.dpp.listDpps();');
console.log('// { dpps: [...], total, limit, offset }');
console.log('');
console.log('// Filter by product, status, or search');
console.log('const filtered = await client.dpp.listDpps({');
console.log('  productId: "01J...",');
console.log('  status: "active",');
console.log('  limit: 10,');
console.log('  offset: 0,');
console.log('  sortBy: "updatedAt",');
console.log('  sortOrder: "desc",');
console.log('});');
console.log('');
console.log('// Get a single DPP');
console.log('const dpp = await client.dpp.getDpp(dppId);');
console.log('');
console.log('// Update status');
console.log('await client.dpp.updateDppStatus(dppId, "published");');
console.log('// Valid statuses: draft, active, published, archived';
console.log('');
console.log('// Delete (soft delete)');
console.log('await client.dpp.deleteDpp(dppId);');`;

const attachmentDemo = `// Upload attachments and generate QR codes
// Requires: authenticated client with dppUrl configured

console.log('// Upload a certificate or document');
console.log('const attachment = await client.dpp.addAttachment(');
console.log('  "dpp_ulid_here",');
console.log('  "certificates",     // section name');
console.log('  certFile            // File object');
console.log(');');
console.log('// Returns: { id, fileName, contentType, url, checksum }');
console.log('');
console.log('// Delete an attachment');
console.log('await client.dpp.deleteAttachment(dppId, attachmentId);');
console.log('');
console.log('// Get a file download URL');
console.log('const fileUrl = client.dpp.getFileUrl(fileId);');
console.log('// -> https://proxy.example.com/interfacer-dpp/file/<id>');
console.log('');
console.log('// Generate a QR code URL for this DPP');
console.log('const qrUrl = client.dpp.getQrCodeUrl(dppId, 300);');
console.log('// -> https://proxy.example.com/interfacer-dpp/dpp/<id>/qr?size=300');
console.log('');
console.log('// Use in an img tag:');
console.log('// <img src={qrUrl} alt="DPP QR Code" />';`;
</script>

# DPP Create & Query

The Digital Product Passport (DPP) is a microservice that stores structured product lifecycle data. All DPP operations use the REST API with DID-based authentication.

## Create a DPP

Passports start in `draft` status and are linked to a product resource on Zenflows:

<!-- <Playground label="Create DPP" :code="createDemo" /> -->

### Linking to a Zenflows Resource

After creating a DPP, link it to a resource on Zenflows:

```ts
const dpp = await client.dpp.createDpp({ ... });

// Create a resource representation on Zenflows
const dppResource = await client.resources.createDppResource({
  name: `DPP for Smart Sensor v2`,
  note: "Digital Product Passport",
  dppUlid: dpp.id, // ← link the DPP ULID
});

// Cite it from the product's creation process
await client.resources.citeResource(dppResource.id, processId);
```

## Query, Filter & Update

<!-- <Playground label="Query DPPs" :code="queryDemo" /> -->

### ListDppsFilters

| Filter | Type | Description |
|--------|------|-------------|
| `productId` | `string` | Filter by product ULID |
| `createdBy` | `string` | Filter by creator ID |
| `status` | `DppStatus` | `"draft"`, `"active"`, `"published"`, `"archived"` |
| `q` | `string` | Full-text search |
| `sortBy` | `string` | Sort field (e.g. `"updatedAt"`) |
| `sortOrder` | `string` | `"asc"` or `"desc"` |
| `limit` | `number` | Page size |
| `offset` | `number` | Offset for pagination |

You can also use `client.dpp.updateDpp(id, data)` to update any fields on an existing DPP.

## Attachments & QR Codes

<!-- <Playground label="Attachments" :code="attachmentDemo" /> -->

## Full Lifecycle

```ts
// 1. Create
const dpp = await client.dpp.createDpp({
  productId: projectId,
  status: "draft",
  productOverview: { name: "Widget", category: "Tools" },
  environmental: { recyclabilityPct: 85 },
});

// 2. Add attachments
const cert = await client.dpp.addAttachment(dpp.id, "certificates", certFile);

// 3. Update fields
await client.dpp.updateDpp(dpp.id, {
  environmental: { repairability: true },
});

// 4. Publish
await client.dpp.updateDppStatus(dpp.id, "published");

// 5. Link to Zenflows resource
const dppRes = await client.resources.createDppResource({
  name: "DPP for Widget",
  dppUlid: dpp.id,
});

// 6. Generate QR code (for product label)
const qrUrl = client.dpp.getQrCodeUrl(dpp.id, 300);
```

## Error Handling

DPP operations throw on non-2xx responses. The error message includes the API response:

```ts
try {
  await client.dpp.createDpp({ ... });
} catch (err) {
  // err.message: "DPP POST /dpp failed: Validation error"
}
```

Common errors:
- **401/403** — Missing or invalid DID signature (not authenticated)
- **404** — DPP or attachment not found
- **400** — Validation error (missing required fields)
- **Network** — `dppUrl` not configured or server unreachable

## Next Steps

- [Create Resource](/recipes/create-resource) — linking DPP to projects
- [Files & Hashing](/guides/files-and-hashing) — uploading DPP attachments
- [API: DppClient](/api/classes/DppClient) — full method reference
