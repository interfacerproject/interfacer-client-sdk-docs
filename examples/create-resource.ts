/**
 * Create Resource — Design, Product, Service, and Machine.
 *
 * Run: npx vitest run examples/create-resource.ts
 *
 * Requires: authenticated client
 */
import { InterfacerClient } from "@dyne/interfacer-client";

const SANDBOX = { proxyUrl: "https://proxy.dpp-dev.ddns.dyne.org" };

// ─── Create Design ──────────────────────────────────────────────────

export async function createDesign(client: InterfacerClient) {
  return client.resources.createProject({
    projectType: "DESIGN",
    name: "My Open Source Design",
    note: "A community-driven hardware design",
    tags: ["open-source", "3d-printing"],
    license: "CERN-OHL-S-2.0",
    repo: "https://github.com/interfacerproject/example-design",
    metadata: { version: "1.0.0", author: "Community" },
  });
}

// ─── Create Product ─────────────────────────────────────────────────

export async function createProduct(client: InterfacerClient) {
  return client.resources.createProject({
    projectType: "PRODUCT",
    name: "3D Printed Enclosure",
    note: "Snap-fit enclosure for IoT boards",
    tags: ["enclosure", "pla"],
    license: "CERN-OHL-P-2.0",
    metadata: { material: "PLA", printTime: "4h", dimensions: "100x60x30mm" },
  });
}

// ─── Create Service ─────────────────────────────────────────────────

export async function createService(client: InterfacerClient) {
  return client.resources.createProject({
    projectType: "SERVICE",
    name: "PCB Assembly Service",
    note: "Professional PCB assembly, 2-week turnaround",
    tags: ["pcb", "assembly"],
    metadata: { turnaroundDays: 14, maxBoardsPerBatch: 50 },
  });
}

// ─── Create Machine ─────────────────────────────────────────────────

export async function createMachine(client: InterfacerClient) {
  return client.resources.createMachine({
    name: "Bambu Lab X1 Carbon",
    note: "Multi-material 3D printer",
    metadata: {
      buildVolume: "256x256x256mm",
      materials: ["PLA", "PETG", "ABS", "TPU"],
    },
  });
}

// ─── Update metadata ────────────────────────────────────────────────

export async function updateResourceMetadata(
  client: InterfacerClient,
  resourceId: string
) {
  await client.resources.updateMetadata(resourceId, {
    version: "2.0.0",
    contributors: [{ name: "Alice", role: "Designer" }],
  });

  await client.resources.updateClassifiedAs(resourceId, [
    "tag-open-source",
    "tag-3d-printing",
  ]);
}

// ─── Client helper ──────────────────────────────────────────────────

export function createClient() {
  return new InterfacerClient(SANDBOX);
}
