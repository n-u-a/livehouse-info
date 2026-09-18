import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDirectory = fileURLToPath(
  new URL("../dist/client/", import.meta.url),
);
const textExtensions = new Set([".css", ".html", ".js", ".rsc"]);

async function rewrite(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewrite(path);
      continue;
    }
    if (!textExtensions.has(extname(entry.name))) continue;

    const source = await readFile(path, "utf8");
    const fixed = source.replaceAll(
      "/assets/_vinext_fonts/",
      "/livehouse-info/assets/_vinext_fonts/",
    );
    if (fixed !== source) await writeFile(path, fixed, "utf8");
  }
}

await rewrite(outputDirectory);
