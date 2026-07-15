/**
 * List Resources — fetch and display projects and machines.
 *
 * Run: npx vitest run examples/list-resources.ts
 *
 * Requires: authenticated client (run authentication.ts first)
 */
import { InterfacerClient } from "@dyne/interfacer-client";

const SANDBOX = { proxyUrl: "https://proxy.dpp-dev.ddns.dyne.org" };

// ─── List projects ──────────────────────────────────────────────────

export async function listProjects(client: InterfacerClient) {
  const projects = await client.resources.getProjects();
  console.log("Projects:", projects);
  return projects;
}

// ─── List machines ──────────────────────────────────────────────────

export async function listMachines(client: InterfacerClient) {
  const machines = await client.resources.getMachines();
  console.log("Machines:", machines);
  return machines;
}

// ─── Get single resource ────────────────────────────────────────────

export async function getResource(client: InterfacerClient, id: string) {
  const resource = await client.resources.getResource(id);
  console.log("Resource:", resource ? "found" : "not found");
  return resource;
}

// ─── Paginated listing ──────────────────────────────────────────────

export async function paginatedList(client: InterfacerClient) {
  const page = await client.resources.listResources(
    {},
    { first: 10 }
  );

  console.log(`Page: ${page.edges?.length || 0} items`);
  console.log("Has next page:", page.pageInfo?.hasNextPage);

  return page;
}

// ─── Authenticated client helper ────────────────────────────────────

export function createClient() {
  return new InterfacerClient(SANDBOX);
}
