import DefaultTheme from "vitepress/theme";
import Playground from "../components/Playground.vue";
import "./custom.css";
import type { Theme } from "vitepress";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("Playground", Playground);
  },
} satisfies Theme;
