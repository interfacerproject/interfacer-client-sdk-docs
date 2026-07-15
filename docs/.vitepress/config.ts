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

  themeConfig: {
    logo: "/logo.svg",
    
    nav: [
      { text: "Home", link: "/" },
      { text: "Guides", link: "/getting-started/installation" },
      { text: "Recipes", link: "/recipes/authenticate" },
      { text: "API", link: "/api/" },
      { text: "Examples", link: "/examples/" },
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
