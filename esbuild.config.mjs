import * as esbuild from "esbuild";
import * as child_process from "node:child_process";

const LAMBDA_PATH = "dist/lambda.js";

const build = async () => {
  await esbuild.build({
    entryPoints: ["src/_lambda/content-cache-hydrator/handler.ts"],
    bundle: true,
    minify: true,
    platform: "node",
    target: "node22",
    outfile: LAMBDA_PATH
  });
}

const createZip = () => {
  child_process.exec(`zip -j dist/lambda.zip ${LAMBDA_PATH}`)
}

try {
  await build();
  createZip();
  console.log("Built lambda successfully!");
} catch (e) {
  console.error("Building lambda failed: ", e);
}
