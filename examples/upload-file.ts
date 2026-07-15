/**
 * Upload File — hash and upload files to Zenflows and DPP.
 *
 * Run: npx vitest run examples/upload-file.ts
 *
 * Requires: authenticated client
 */
import { InterfacerClient } from "@dyne/interfacer-client";

const SANDBOX = { proxyUrl: "https://proxy.dpp-dev.ddns.dyne.org" };

// ─── Hash for Zenflows (SHA-512 via Zenroom) ────────────────────────

export async function hashForZenflows(file: File) {
  const client = new InterfacerClient(SANDBOX);
  const hash = await client.files.hashFileForZenflows(file);
  console.log("SHA-512:", hash);
  return hash;
}

// ─── Hash for DPP (SHA-256 via Web Crypto) ──────────────────────────

export async function hashForDpp(file: File) {
  const client = new InterfacerClient(SANDBOX);
  const checksum = await client.files.hashFileSHA256(file);
  console.log("SHA-256:", checksum);
  return checksum;
}

// ─── Prepare files for Zenflows ─────────────────────────────────────

export async function prepareFiles(files: File[]) {
  const client = new InterfacerClient(SANDBOX);
  const prepared = await client.files.prepFilesForZenflows(files);

  for (const f of prepared) {
    console.log(`${f.name}: ${f.hash.substring(0, 12)}... (${f.size} bytes)`);
  }

  return prepared;
}

// ─── Upload to Zenflows ─────────────────────────────────────────────

export async function uploadToZenflows(file: File) {
  const client = new InterfacerClient(SANDBOX);
  await client.files.uploadToZenflows(file);
  console.log("Uploaded to Zenflows:", file.name);
}

// ─── Upload to DPP ──────────────────────────────────────────────────

export async function uploadToDpp(file: File) {
  const client = new InterfacerClient(SANDBOX);
  const attachment = await client.files.uploadToDpp(file);
  console.log("DPP attachment:", attachment.id);
  return attachment;
}

// ─── File URL helpers ───────────────────────────────────────────────

export function getFileUrls() {
  const client = new InterfacerClient(SANDBOX);

  const url = client.files.getFileUrl("abcdef1234567890");
  console.log("File URL:", url);

  const src = client.files.getImageSrc({
    hash: "abcdef1234567890",
    name: "photo.png",
    mimeType: "image/png",
  });
  console.log("Image src:", src);
}

// ─── Client helper ──────────────────────────────────────────────────

export function createClient() {
  return new InterfacerClient(SANDBOX);
}
