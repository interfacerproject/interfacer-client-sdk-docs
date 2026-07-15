/**
 * Serve VitePress docs with WebContainers-compatible headers.
 * Usage: node serve.js [port]
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { existsSync } from "node:fs";

const PORT = parseInt(process.argv[2] || "4173", 10);
const ROOT = join(process.cwd(), "docs/.vitepress/dist");

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

  let path = req.url === "/" ? "/index.html" : req.url;
  if (!extname(path)) path += ".html";

  const filePath = join(ROOT, path);

  if (!existsSync(filePath) || filePath.includes("..")) {
    const index = join(ROOT, "index.html");
    if (existsSync(index)) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(await readFile(index));
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
    return;
  }

  const ext = extname(filePath);
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  res.end(await readFile(filePath));
}).listen(PORT, () => {
  console.log(`\n  Docs: http://localhost:${PORT}/`);
  console.log(`  COOP/COEP headers enabled — WebContainers ready\n`);
});
