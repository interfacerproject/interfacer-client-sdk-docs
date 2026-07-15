/**
 * Getting Started — create a client and check basic status.
 *
 * This file is referenced directly by the documentation and tested in CI.
 * Run: npx vitest run examples/getting-started.ts
 */
import { InterfacerClient } from "@dyne/interfacer-client";

// ─── Configuration ──────────────────────────────────────────────────

const config = {
  proxyUrl: "https://proxy.dpp-dev.ddns.dyne.org",
};

// ─── Create client ──────────────────────────────────────────────────

const client = new InterfacerClient(config);

// ─── Status checks ──────────────────────────────────────────────────

export function checkStatus() {
  const authenticated = client.isAuthenticated();
  const publicKey = client.getPublicKey();

  console.log("Authenticated:", authenticated);   // false (no keys yet)
  console.log("Public key:", publicKey);           // null

  return { authenticated, publicKey };
}

// ─── Sub-clients ────────────────────────────────────────────────────

export function listSubClients() {
  const names = [
    "auth", "graphql", "resources", "files", "dpp",
    "inbox", "wallet", "social", "tagging", "import",
  ] as const;

  for (const name of names) {
    // Access triggers lazy initialization
    console.log(`${name}:`, typeof (client as any)[name]);
  }
}

// ─── Run ────────────────────────────────────────────────────────────

if (import.meta.url === `file://${process.argv[1]}`) {
  checkStatus();
  listSubClients();
}
