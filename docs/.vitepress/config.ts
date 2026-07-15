import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Interfacer Client SDK",
  description: "TypeScript SDK for the Interfacer ecosystem — Zenflows, DPP, Inbox, Wallet, Social",
  lang: "en-US",
  base: "/",

  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#00B4A6" }],
  ],

  // WebContainers: COOP/COEP headers for SharedArrayBuffer (dev only)
  vite: {
    plugins: [{
      name: "coop-coep-headers",
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    }],
  },

  themeConfig: {
    logo: "/logo.svg",

    nav: [
      { text: "Home", link: "/" },
      { text: "Guides", link: "/getting-started/installation" },
      { text: "Recipes", link: "/recipes/authenticate" },
      { text: "API", link: "/api/" },
    ],

    sidebar: {
      "/getting-started/": [
        { text: "Getting Started", items: [
          { text: "Installation", link: "/getting-started/installation" },
          { text: "Quick Start", link: "/getting-started/quick-start" },
          { text: "Authentication", link: "/getting-started/authentication" },
        ]},
      ],
      "/guides/": [
        { text: "Guides", items: [
          { text: "Client", link: "/guides/client" },
          { text: "Requests", link: "/guides/requests" },
          { text: "Responses", link: "/guides/responses" },
          { text: "Errors", link: "/guides/errors" },
        ]},
        { text: "Architecture", link: "/guides/architecture" },
        { text: "Changelog", link: "/guides/changelog" },
      ],
      "/recipes/": [
        { text: "Recipes", items: [
          { text: "Authenticate", link: "/recipes/authenticate" },
          { text: "Create Resource", link: "/recipes/create-resource" },
          { text: "Upload Document", link: "/recipes/upload-document" },
          { text: "Pagination", link: "/recipes/pagination" },
          { text: "Error Handling", link: "/recipes/error-handling" },
        ]},
      ],
      "/api/": [
        { text: "API Reference", items: [
          { text: "Overview", link: "/api/" },
          { text: "InterfacerClient", link: "/api/classes/InterfacerClient" },
          { text: "AuthClient", link: "/api/classes/AuthClient" },
          { text: "ResourceClient", link: "/api/classes/ResourceClient" },
          { text: "FileClient", link: "/api/classes/FileClient" },
          { text: "DppClient", link: "/api/classes/DppClient" },
          { text: "InboxClient", link: "/api/classes/InboxClient" },
          { text: "WalletClient", link: "/api/classes/WalletClient" },
          { text: "SocialClient", link: "/api/classes/SocialClient" },
          { text: "TaggingClient", link: "/api/classes/TaggingClient" },
          { text: "ImportClient", link: "/api/classes/ImportClient" },
          { text: "GraphQLClient", link: "/api/classes/GraphQLClient" },
        ]},
        { text: "Configuration", items: [
          { text: "InterfacerConfig", link: "/api/interfaces/InterfacerConfig" },
          { text: "KeyStorage", link: "/api/interfaces/KeyStorage" },
        ]},
        { text: "Types", items: [
          { text: "ProjectType", link: "/api/enumerations/ProjectType" },
          { text: "DppDocument", link: "/api/interfaces/DppDocument" },
          { text: "Functions", link: "/api/functions/" },
        ]},
      ],
    },

    search: {
      provider: "local",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/interfacerproject/interfacer-client" },
    ],

    footer: {
      message: "AGPL-3.0-or-later",
      copyright: "Copyright © Dyne.org foundation",
    },
  },

  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
  },
});
