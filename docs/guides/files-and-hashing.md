---
layout: doc
---

<script setup>
const zenflowsDemo = `import { prepFilesForZenflows } from '@dyne/interfacer-client';

// Simulate preparing files for Zenflows upload
// In a browser, you'd get Files from <input type="file">
// const files = event.target.files;

console.log('// In real code:');
console.log('const files = event.target.files;');
console.log('const descriptors = await prepFilesForZenflows(files);');
console.log('');
console.log('// Each descriptor:');
console.log('{');
console.log('  name: "schematic.pdf",');
console.log('  extension: "pdf",');
console.log('  hash: "base64url...",         // SHA-512 via Zenroom');
console.log('  mimeType: "application/pdf",');
console.log('  size: 2048576,');
console.log('}');
console.log('');
console.log('// Then upload:');
console.log('await client.files.uploadToZenflows(file);');
console.log('// or batch:');
console.log('await client.files.uploadToZenflowsBatch(files);');`;

const hashDemo = `import { hashFileSHA256 } from '@dyne/interfacer-client';

// SHA-256 via Web Crypto API (for DPP uploads)
// Returns hex-encoded checksum
console.log('// In real code:');
console.log('const checksum = await hashFileSHA256(file);');
console.log('// checksum: "a7f5e..."  (hex)');
console.log('');
console.log('Two hashing strategies:');
console.log('  Zenflows: SHA-512 (Zenroom) -> base64url');
console.log('  DPP:      SHA-256 (Web Crypto) -> hex');`;

const imageDemo = `import {
  formatImageSrc, getResourceImage
} from '@dyne/interfacer-client';

// From GraphQL response — base64 bin data
const image = {
  name: 'hero.png',
  hash: 'abc123',
  mimeType: 'image/png',
  bin: 'iVBORw0KGgo...',  // base64
};

console.log('formatImageSrc:');
console.log(formatImageSrc(image.mimeType, image.bin));
// -> data:image/png;base64,iVBORw0KGgo...

console.log('');
console.log('getResourceImage:');
console.log(getResourceImage([image]));
// -> same data URL, or empty string if no images`;

const dppModelDemo = `import {
  uploadModelFilesToDpp,
  dppAttachmentToProjectModel,
} from '@dyne/interfacer-client';

console.log('// In real code:');
console.log('const models = await client.files');
console.log('  .uploadModelsToDpp(modelFiles);');
console.log('');
console.log('// Returns ProjectModelMetadata[]:');
console.log('{');
console.log('  name: "enclosure.stl",');
console.log('  extension: "stl",');
console.log('  url: "https://.../dpp/file/<id>",');
console.log('  downloadUrl: "https://.../dpp/file/<id>",');
console.log('  storage: "dpp",');
console.log('  checksum: "a7f5e...",');
console.log('  contentType: "application/octet-stream"');
console.log('}');
console.log('');
console.log('// Store model URLs in metadata:');
console.log('const modelUrls = models.map(m => m.url);');
console.log('');
console.log('await client.resources.createProject({');
console.log('  metadata: { models: modelUrls }');
console.log('});');`;

const proxyDemo = `import { FileClient } from '@dyne/interfacer-client';

// Access file utilities via the client
// client.files.hashFileSHA256(file)
// client.files.hashFileForZenflows(file)
// client.files.prepFilesForZenflows([file])
// client.files.uploadToZenflows(file)
// client.files.uploadToZenflowsBatch(files)
// client.files.uploadToDpp(file)
// client.files.uploadModelsToDpp(files)
// client.files.getFileUrl(hash)
// client.files.getImageSrc({ mimeType, bin })
// client.files.dppAttachmentToProjectModel(attachment)

// Proxy URL for viewing files (hash-based)
console.log('client.files.getFileUrl("abc123");');
console.log('// -> /api/file/abc123');`;
</script>

# Files & Hashing

The SDK provides cryptographic hashing and file uploads for both Zenflows (GraphQL) and the DPP microservice. All operations are available through `client.files`.

## Two Hashing Strategies

| Service | Algorithm | Engine | Encoding |
|---------|-----------|--------|----------|
| Zenflows | SHA-512 | Zenroom (WASM) | base64url |
| DPP | SHA-256 | Web Crypto API | hex |

Zenflows uses Zenroom for its SHA-512 implementation (required for on-chain verification). DPP uses the browser's native Web Crypto API for SHA-256 checksums.

## Zenflows File Uploads

Prepare file descriptors, then upload:

<!-- <Playground label="Zenflows Upload" :code="zenflowsDemo" /> -->

**`prepFilesForZenflows`** hashes each file and returns a `ZenflowsFile[]` with `name`, `extension`, `hash`, `mimeType`, and `size`. These descriptors are included when calling `createProject` via the `images` parameter.

**`uploadToZenflows(file)`** sends the file to the Zenflows file storage endpoint. Use **`uploadToZenflowsBatch(files)`** for multiple files.

## DPP Hashing

<!-- <Playground label="Hash" :code="hashDemo" /> -->

## Image Utilities

When reading image data from GraphQL responses (which include base64 `bin` data), use these helpers to construct data URLs:

<!-- <Playground label="Image Helpers" :code="imageDemo" /> -->

## DPP File Uploads

Upload files to the DPP service with DID-based authentication:

```ts
// Upload a single file (e.g., screenshot, PDF)
const attachment = await client.files.uploadToDpp(file);
// Returns DppAttachment with id, url, checksum, contentType

// Upload 3D model files (STL, STEP, etc.)
const models = await client.files.uploadModelsToDpp(modelFiles);
// Returns ProjectModelMetadata[] — ready for createProject metadata
```

<!-- <Playground label="DPP Model Upload" :code="dppModelDemo" /> -->

## Conversion: DPP Attachment → Model Metadata

When a file is uploaded to DPP, you get a `DppAttachment`. Convert it to project model metadata:

```ts
const attachment = await client.files.uploadToDpp(file);
const model = client.files.dppAttachmentToProjectModel(attachment);
// model.url = `${config.dppUrl}/file/${attachment.id}`
// model.storage = "dpp"
```

## Full Client API

All file operations are accessed through `client.files`:

<!-- <Playground label="Client API" :code="proxyDemo" /> -->

## Standalone Functions

All hashing utilities are also exported as standalone functions for use without a client:

```ts
import {
  formatImageSrc,
  getResourceImage,
  prepFileForZenflows,
  prepFilesForZenflows,
  dppAttachmentToProjectModel,
} from "@dyne/interfacer-client";
```

## Error Handling

File operations can fail for several reasons:
- **Network errors** — `fetch` throws on connection issues
- **Upload errors** — `res.ok === false`, check `response.statusText`
- **WASM init failure** — Zenroom may fail if WebAssembly is blocked
- **Storage errors** — `KeyStorage.getItem` may return null if keys aren't present

Always wrap file operations in try/catch:

```ts
try {
  await client.files.uploadToZenflows(file);
} catch (err) {
  console.error("Upload failed:", err.message);
}
```

## Next Steps

- [Create Resource](/recipes/create-resource) — using file descriptors in project creation
- [Configuration](/guides/configuration) — endpoint setup for file uploads
- [API: FileClient](/api/classes/FileClient) — full method reference
