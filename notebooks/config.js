/**
 * Interfacer Sandbox Configuration
 *
 * Default read-only sandbox endpoints for the Interfacer ecosystem.
 * Users can override these with their own instance URLs.
 *
 * Usage in notebooks:
 *   const config = (await import('./static/config.js')).SANDBOX_CONFIG;
 *   const client = new InterfacerClient(config);
 */

export const SANDBOX_PROXY_URL = "https://proxy.dpp-dev.ddns.dyne.org";

export const SANDBOX_CONFIG = {
  proxyUrl: SANDBOX_PROXY_URL,
};

/**
 * Full explicit endpoint configuration (derived from proxyUrl above).
 * Use this if you need to override individual endpoints.
 */
export const SANDBOX_ENDPOINTS = {
  zenflowsUrl: `${SANDBOX_PROXY_URL}/zenflows/api`,
  zenflowsFileUrl: `${SANDBOX_PROXY_URL}/zenflows/api/file`,
  dppUrl: `${SANDBOX_PROXY_URL}/interfacer-dpp`,
  inbox: {
    send: `${SANDBOX_PROXY_URL}/inbox/send`,
    read: `${SANDBOX_PROXY_URL}/inbox/read`,
    countUnread: `${SANDBOX_PROXY_URL}/inbox/count-unread`,
    setRead: `${SANDBOX_PROXY_URL}/inbox/set-read`,
  },
  walletUrl: `${SANDBOX_PROXY_URL}/wallet/token`,
  social: {
    personBase: `${SANDBOX_PROXY_URL}/inbox/person`,
    economicResourceBase: `${SANDBOX_PROXY_URL}/inbox/economicresource`,
  },
  oshUrl: `${SANDBOX_PROXY_URL}/osh`,
};
