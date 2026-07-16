import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Interfacer Client SDK",
  description: "TypeScript SDK for the Interfacer ecosystem — Zenflows, DPP, Inbox, Wallet, Social",
  lang: "en-US",
  base: "/interfacer-client-sdk-docs/",

  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#00B4A6" }],
  ],

  themeConfig: {
    logo: "/logo.svg",

    nav: [
      { text: "Home", link: "/" },
      { text: "Guides", link: "/getting-started/installation" },
      { text: "Recipes", link: "/recipes/authenticate" },
      { text: "API", link: "/api/README" },
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
          { text: "Configuration", link: "/guides/configuration" },
          { text: "Files & Hashing", link: "/guides/files-and-hashing" },
          { text: "Signing & Crypto", link: "/guides/signing-and-crypto" },
          { text: "Apollo Migration", link: "/guides/apollo-migration" },
          { text: "Tagging System", link: "/guides/tagging-system" },
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
          { text: "Apply Tags & Filters", link: "/recipes/apply-tags-and-filters" },
          { text: "Upload Document", link: "/recipes/upload-document" },
          { text: "DPP Create & Query", link: "/recipes/dpp-create-and-query" },
          { text: "Send & Read Messages", link: "/recipes/send-message" },
          { text: "Wallet Points", link: "/recipes/wallet-points" },
          { text: "Like & Follow", link: "/recipes/like-and-follow" },
          { text: "Feedback & Reviews", link: "/guides/feedback-reviews" },
          { text: "Import GitHub/GitLab", link: "/recipes/import-github-repo" },
          { text: "Pagination", link: "/recipes/pagination" },
          { text: "Error Handling", link: "/recipes/error-handling" },
        ]},
      ],
      "/api/": [
        { text: "API Reference", items: [
          { text: "Overview", link: "/api/README" },
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
