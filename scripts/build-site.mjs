// Publish the Triport site (triport-site/) to dist/ for Vercel/Netlify, and write sitemap + robots.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const src = path.join(root, "triport-site");
const out = path.join(root, "dist");

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(src, out, { recursive: true });

const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html") && !e.name.includes("@bare=true") && e.name !== "home.html") pages.push(path.relative(out, p).split(path.sep).join("/"));
  }
})(out);

const site = "https://triportagro.com";
const urls = pages
  .map((p) => (p === "index.html" ? "/" : `/${p.replace(/\.html$/, "")}`))
  .filter((u) => !/news@page=/.test(u))
  .sort();
fs.writeFileSync(
  path.join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${site}${u}</loc></url>`).join("\n")}\n</urlset>\n`
);
fs.writeFileSync(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`Published ${pages.length} pages to dist/ (${urls.length} in sitemap)`);
