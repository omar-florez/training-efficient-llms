#!/usr/bin/env node
// Pre-render all KaTeX math in a chapter HTML file to MathML, so the page
// needs no CDN, no JavaScript, and no web fonts — math renders natively in
// browsers and in PDF export alike.
//
//   node scripts/render_math.js chapters/ch01_programs.html [more.html ...]
//
// Replaces $$…$$ (display) and \(…\) (inline) outside <pre> blocks, and strips
// the KaTeX <link>/<script> tags and the offline-fallback script if present.
const fs = require("fs");
const katex = require("katex");

function renderTex(tex, display) {
  return katex.renderToString(tex, {
    displayMode: display,
    output: "mathml",          // MathML Core: native in Chrome/Firefox/Safari, zero deps
    throwOnError: false,
    strict: false,
  });
}

function processSegment(seg) {
  seg = seg.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) =>
    `<div class="math-display">${renderTex(tex.trim(), true)}</div>`);
  seg = seg.replace(/\\\(([\s\S]+?)\\\)/g, (_, tex) => renderTex(tex.trim(), false));
  return seg;
}

for (const file of process.argv.slice(2)) {
  let html = fs.readFileSync(file, "utf8");
  const before = (html.match(/\\\(|\$\$/g) || []).length;

  // never touch code blocks
  const parts = html.split(/(<pre[\s\S]*?<\/pre>)/);
  html = parts.map((p, i) => (i % 2 === 1 ? p : processSegment(p))).join("");

  // remove the KaTeX CDN tags and the offline fallback script
  html = html.replace(/<link[^>]*katex[^>]*>\s*/gi, "");
  html = html.replace(/<script[^>]*katex[^>]*><\/script>\s*/gi, "");
  html = html.replace(/<script>\s*\/\/ Graceful fallback[\s\S]*?<\/script>\s*/, "");
  // display-math spacing + slightly larger math, once
  if (!html.includes(".math-display{")) {
    html = html.replace("</style>",
      ".math-display{margin:18px 0;text-align:center}\nmath{font-size:1.12em}\n</style>");
  }

  const after = (html.match(/\\\(|\$\$/g) || []).length;
  fs.writeFileSync(file, html);
  console.log(`${file}: ${before} math markers -> ${after} remaining (should be 0)`);
}
