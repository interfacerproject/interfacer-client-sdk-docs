/**
 * Authentication — full Keypairoom auth flow.
 *
 * Run: npx vitest run examples/authentication.ts
 */
import { InterfacerClient } from "@dyne/interfacer-client";

const SANDBOX = { proxyUrl: "https://proxy.dpp-dev.ddns.dyne.org" };

// ─── Full registration flow ─────────────────────────────────────────

export async function register(
  email: string,
  username: string,
  name: string,
  challenges: {
    whereParentsMet: string;
    nameFirstPet: string;
    nameFirstTeacher: string;
    whereHomeTown: string;
    nameMotherMaid: string;
  }
) {
  const client = new InterfacerClient(SANDBOX);

  // Step 1: Request server-side HMAC shard
  const hmac = await client.auth.requestHmac(email, true);

  // Step 2: Derive all keypairs from challenges + HMAC
  const keyring = await client.auth.deriveKeys(challenges, email, hmac);

  console.log("Seed (save this!):", keyring.seed);
  console.log("EdDSA public key:", keyring.eddsa_public_key.substring(0, 20) + "...");

  // Step 3: Register the user on Zenflows
  const agentId = await client.auth.registerUser({
    name,
    user: username,
    email,
  });

  console.log("Agent ID:", agentId);

  // Step 4: Login (verify + enable signing)
  const profile = await client.auth.login({ email });

  console.log("Profile:", profile.name, `(${profile.username})`);

  return { client, keyring, profile };
}

// ─── Returning user flow ────────────────────────────────────────────

export async function loginWithSeed(email: string, seed: string) {
  const client = new InterfacerClient(SANDBOX);

  const hmac = await client.auth.requestHmac(email, false);
  await client.auth.recreateKeys(seed, hmac);
  const profile = await client.auth.login({ email });

  return { client, profile };
}

// ─── Status check ───────────────────────────────────────────────────

export function isAuthenticated(client: InterfacerClient) {
  return client.isAuthenticated();
}
