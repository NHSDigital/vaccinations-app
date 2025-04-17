import * as esbuild from "esbuild";
import * as fs from "node:fs";

const OUTPUT_DIR = "dist";

const removeDistDirectory = async () => {
  fs.rm(OUTPUT_DIR, { recursive: true, force: true }, (err) => {
    if (err) throw err;
    console.log(`Directory '${OUTPUT_DIR}' deleted!`);
  });
};

const copyExtraFiles = async () => {
  // there is an issue with esbuild putting a warning for xhr-sync-worker.js file being external
  // at runtime, lambda complains that the file is not present
  // DOMPurify apparently depends on this file
  fs.copyFile("./node_modules/jsdom/lib/jsdom/living/xhr/xhr-sync-worker.js", `${OUTPUT_DIR}/xhr-sync-worker.js`, (err) => {
    if (err) throw err;
    console.log("Copied xhr-sync-worker.js (workaround)");
  });
};

const buildLambda = async () => {
  await esbuild.build({
    entryPoints: ["src/_lambda/content-cache-hydrator/handler.ts"],
    bundle: true,
    minify: true,
    platform: "node",
    jsx: "automatic",
    target: "node22",
    external: ["./xhr-sync-worker.js"],
    outfile: `${OUTPUT_DIR}/lambda.js`
  });
};

try {
  await removeDistDirectory();
  await buildLambda();
  await copyExtraFiles();
  console.log(`Built lambda successfully -> ${OUTPUT_DIR}/lambda.js`);
} catch (e) {
  console.error("Building lambda failed: ", e);
}
