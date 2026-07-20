---
layout: doc
---

<script setup>
const uploadDemo = `import { prepFilesForZenflows } from '@dyne/interfacer-client';

// Recipe: Upload images for a new project
// 1. User selects files
// const files = input.files;

// 2. Hash and prepare descriptors
// const descriptors = await client.files.prepFilesForZenflows(files);
console.log('// 2. Hash and prepare');
console.log('const descriptors = await client.files');
console.log('  .prepFilesForZenflows(files);');
console.log('');
console.log('// 3. Upload to Zenflows');
console.log('for (const file of files) {');
console.log('  await client.files.uploadToZenflows(file);');
console.log('}');
console.log('');
console.log('// 4. Pass descriptors to createProject');
console.log('const project = await client.resources');
console.log('  .createProject({');
console.log('    projectType: ProjectType.PRODUCT,');
console.log('    name: "My Project",');
console.log('    images: descriptors,');
console.log('  });';`;

const dppDemo = `// Recipe: Upload images via DPP for higher-quality storage

// 1. Upload each image to DPP
// const attachments = [];
// for (const file of files) {
//   const att = await client.files.uploadToDpp(file);
//   attachments.push(att);
// }

console.log('// 1. Upload to DPP');
console.log('const attachments = await Promise.all(');
console.log('  files.map(f => client.files.uploadToDpp(f))');
console.log(');');
console.log('');
console.log('// 2. Build image URLs');
console.log('const imageUrls = attachments.map(att =>');
console.log('  client.config.dppUrl + "/file/" + att.id');
console.log(');');
console.log('');
console.log('// 3. Store URLs in metadata');
console.log('const project = await client.resources');
console.log('  .createProject({');
console.log('    projectType: ProjectType.PRODUCT,');
console.log('    name: "My Project",');
console.log('    metadata: {');
console.log('      image: imageUrls.length === 1');
console.log('        ? imageUrls[0] : imageUrls');
console.log('    }');
console.log('  });';`;
</script>

# Upload Documents & Files

The SDK supports dual file storage — Zenflows for general file uploads and DPP for high-quality image and model storage. See [Files & Hashing](/guides/files-and-hashing) for the complete API reference.

## Upload to Zenflows

Hash files, upload, pass descriptors to project creation:

<!-- <Playground label="Zenflows" :code="uploadDemo" /> -->

## Upload to DPP

For images and 3D models, DPP storage offers higher quality and a dedicated CDN:

<!-- <Playground label="DPP Images" :code="dppDemo" /> -->

## Model File Upload

Uploading 3D model files (STL, STEP, etc.) to DPP:

```ts
const modelFiles = [stlFile, stepFile];
const models = await client.files.uploadModelsToDpp(modelFiles);
// → ProjectModelMetadata[]

// Store in project metadata
const modelUrls = models.map(m => m.url);
await client.resources.createProject({
  metadata: { models: modelUrls },
});
```

## Displaying Images

From GraphQL responses (base64 `bin` data):

```ts
const src = client.files.getImageSrc({ mimeType: "image/png", bin: "..." });
// → data:image/png;base64,...
```

From DPP attachments:

```ts
const url = client.dpp.getFileUrl(attachmentId);
// → https://proxy.example.com/interfacer-dpp/file/<id>
```

## DPP Attachments

Upload documents to specific DPP sections (certificates, compliance, etc.):

```ts
// Add
const cert = await client.dpp.addAttachment(dppId, "certificates", file);

// Remove
await client.dpp.deleteAttachment(dppId, cert.id);
```

## Error Handling

| Issue | Cause | Fix |
|-------|-------|-----|
| Zenroom hash fails | WASM blocked or COOP/COEP headers missing | Fall back to SHA-256; use DPP upload |
| Upload 403 | Zenflows file URL not configured | Set `zenflowsFileUrl` in config |
| Upload 401 (DPP) | DID signature missing | Authenticate first |
| File too large | Server limit exceeded | Compress or split uploads |

## Next Steps

- [Files & Hashing](/guides/files-and-hashing) — complete API reference
- [Create Resource](/recipes/create-resource) — using file descriptors in projects
- [DPP Create & Query](/recipes/dpp-create-and-query) — DPP attachments and lifecycle
