import * as esbuild from "esbuild";
import * as fs from "node:fs";

const OUTPUT_DIR = "dist";

const rmDistDirectory = async () => {
  fs.rm(OUTPUT_DIR, { recursive: true, force: true }, (err) => {
    if (err) throw err;
    console.log(`Directory '${OUTPUT_DIR}' deleted!`);
  });
};

const buildLambda = async () => {
  await esbuild.build({
    entryPoints: ["src/_lambda/content-cache-hydrator/handler.ts"],
    bundle: true,
    minify: true,
    platform: "node",
    target: "node22",
    outfile: `${OUTPUT_DIR}/lambda.js`
  });
};

try {
  await rmDistDirectory();
  await buildLambda();
  console.log(`Built lambda successfully -> ${OUTPUT_DIR}/lambda.js`);
} catch (e) {
  console.error("Building lambda failed: ", e);
}
