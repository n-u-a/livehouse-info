import { readFile, writeFile } from "node:fs/promises";

// vinext 0.0.50 prerenders App Router URLs without next.config's basePath.
// Prefix only the internal HTTP requests; output files still belong at the
// artifact root because GitHub Pages mounts that root at /livehouse-info/.
const file = new URL(
  "../node_modules/vinext/dist/build/prerender.js",
  import.meta.url,
);
const source = await readFile(file, "utf8");
const from = "new Request(`http://localhost${urlPath}`";
const to =
  "new Request(`http://localhost${config.basePath ?? \"\"}${urlPath}`";

if (source.includes(to)) {
  process.exit(0);
}

const matches = source.split(from).length - 1;
if (matches !== 2) {
  throw new Error(
    `Expected two vinext prerender request sites, found ${matches}. ` +
      "Review whether the upstream basePath workaround is still required.",
  );
}

await writeFile(file, source.replaceAll(from, to), "utf8");
