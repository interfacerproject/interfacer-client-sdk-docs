# Upload Document

Hash and upload files to Zenflows and DPP.

## Hashing

The SDK provides dual hashing:

| Algorithm | Engine | Use |
|-----------|--------|-----|
| SHA-512 | Zenroom (WASM) | Zenflows file integrity |
| SHA-256 | Web Crypto API | DPP attachment integrity |

### Hash for Zenflows

```ts
const hash = await client.files.hashFileForZenflows(file);
// SHA-512 via Zenroom
```

### Hash for DPP

```ts
const checksum = await client.files.hashFileSHA256(file);
// SHA-256 via Web Crypto
```

## Prepare Files for Upload

```ts
const files = [file1, file2, file3];
const prepared = await client.files.prepFilesForZenflows(files);
// Returns ZenflowsFile[] with { name, hash, mimeType, extension, size }
```

## Upload to Zenflows

```ts
await client.files.uploadToZenflows(file);

// Batch
await client.files.uploadToZenflowsBatch(files);
```

## Upload to DPP

```ts
const attachment = await client.files.uploadToDpp(file);
// Returns DppAttachment with { id, fileName, contentType, url, size, checksum }
```

## Upload 3D Models to DPP

```ts
const models = await client.files.uploadModelsToDpp(modelFiles);
// Returns ProjectModelMetadata[]
```

## File URL Helpers

```ts
const url = client.files.getFileUrl(hash);
// /api/file/{hash}

const src = client.files.getImageSrc(gqlImage);
// data:image/png;base64,... (if bin present)
// /api/file/{hash} (fallback)
```

## DPP Attachments

```ts
// Add attachment by section
await client.dpp.addAttachment(dppId, "certificates", file);

// Delete
await client.dpp.deleteAttachment(dppId, attachmentId);

// Download URL
const downloadUrl = client.dpp.getFileUrl(fileId);
```

## Error Recovery

| Scenario | Fix |
|----------|-----|
| SHA-512 fails | Zenroom WASM may not be available (browser without COOP/COEP) |
| Upload fails | Check `zenflowsFileUrl` or `dppUrl` config |
| File too large | Check server limits |
