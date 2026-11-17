// Copies the canonical contract into public/ so the browser can deploy it.
// Runs automatically before dev/build (see package.json predev/prebuild).
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "../../contracts/ReviewBatch.py");
const dest = resolve(here, "../public/ReviewBatch.py");
mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log("synced contract -> public/ReviewBatch.py");
