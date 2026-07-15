/**
 * JupyterLite CDN Import Helpers
 *
 * In the browser-based JupyterLite environment, there is no Node.js or npm.
 * We load packages via ESM CDN (esm.sh) which auto-bundles npm packages
 * for browser consumption.
 *
 * ## Why CDN instead of npm install?
 *
 * JupyterLite runs entirely in your browser using Web Workers.
 * There's no filesystem access for `node_modules` or a `package.json`.
 * esm.sh provides on-the-fly ESM bundling — it resolves the package,
 * its dependencies, and returns a browser-compatible module.
 *
 * ## For production Node.js apps:
 *
 * ```bash
 * pnpm add @dyne/interfacer-client zenroom
 * ```
 *
 * ```js
 * import { InterfacerClient } from '@dyne/interfacer-client';
 * ```
 */

// ─── Version pins for reproducible notebooks ────────────────────────

const CDN = 'https://esm.sh';

/** @dyne/interfacer-client — main SDK */
export const INTERFACER_CLIENT_CDN = `${CDN}/@dyne/interfacer-client`;

/** zenroom — WASM crypto VM (peer dependency) */
export const ZENROOM_CDN = `${CDN}/zenroom`;

// ─── Dynamic imports ─────────────────────────────────────────────────

let _interfacerModule: typeof import('@dyne/interfacer-client') | null = null;

/** Load (or return cached) the InterfacerClient module. */
export async function loadInterfacerClient() {
  if (_interfacerModule) return _interfacerModule;
  _interfacerModule = await import(INTERFACER_CLIENT_CDN);
  return _interfacerModule;
}

/** Quick access to InterfacerClient class. */
export async function getInterfacerClient() {
  const mod = await loadInterfacerClient();
  return mod.InterfacerClient;
}
