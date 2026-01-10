import fs from "node:fs/promises";
import path from "node:path";
import jsdoc2md from "jsdoc-to-markdown";

const PROJECT_ROOT = process.cwd();
const SRC_ROOT = path.join(PROJECT_ROOT, "js");          // your source folder
const OUT_ROOT = path.join(PROJECT_ROOT, "docs", "api"); // gitbook API output

function toPosix(p) {
  return p.split(path.sep).join("/");
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (e.isFile() && e.name.endsWith(".js")) files.push(full);
  }
  return files;
}

function titleFromFile(filePath) {
  return path.basename(filePath, ".js");
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function build() {
  // Clean old API docs
  await fs.rm(OUT_ROOT, { recursive: true, force: true });
  await ensureDir(OUT_ROOT);

  const srcFiles = await walk(SRC_ROOT);

  // Generate one .md per file (mirrors folder structure)
  const generated = [];
  for (const absFile of srcFiles) {
    const relFromSrc = path.relative(SRC_ROOT, absFile);         // e.g. core/BaseShape.js
    const outRel = relFromSrc.replace(/\.js$/, ".md");           // e.g. core/BaseShape.md
    const outAbs = path.join(OUT_ROOT, outRel);

    await ensureDir(path.dirname(outAbs));

    const title = titleFromFile(absFile);

    const md = await jsdoc2md.render({ files: absFile });

    // Add a nice page title for GitBook + a tiny breadcrumb
    const header = `# ${title}\n\n_Source: \`${toPosix(path.join("js", relFromSrc))}\`_\n\n`;
    await fs.writeFile(outAbs, header + (md.trim() ? md : "_No JSDoc found in this file._") + "\n", "utf8");

    generated.push({ title, outRel: toPosix(outRel), srcRel: toPosix(relFromSrc) });
  }

  // Generate API index page
  const byFolder = new Map();
  for (const g of generated) {
    const folder = g.outRel.includes("/") ? g.outRel.split("/")[0] : "(root)";
    if (!byFolder.has(folder)) byFolder.set(folder, []);
    byFolder.get(folder).push(g);
  }
  for (const [, list] of byFolder) list.sort((a, b) => a.title.localeCompare(b.title));

  let index = `# API overview\n\nThis section is generated from JSDoc comments in \`/js\`.\n\n`;
  for (const [folder, list] of [...byFolder.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    index += `## ${folder}\n\n`;
    for (const item of list) {
      index += `- [${item.title}](${item.outRel})\n`;
    }
    index += `\n`;
  }
  await fs.writeFile(path.join(OUT_ROOT, "README.md"), index, "utf8");

  console.log(`Generated ${generated.length} API pages into ${toPosix(path.relative(PROJECT_ROOT, OUT_ROOT))}/`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
