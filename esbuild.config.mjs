import * as esbuild from "esbuild";

const build = async () => {
  await esbuild.build({
    entryPoints: ["src/_lambda/content-cache-hydrator/handler.ts"],
    bundle: true,
    minify: true,
    platform: "node",
    target: "node22",
    outfile: "dist/lambda.js"
  });
}

try {
  await build();
  console.log("Built lambda successfully!");
} catch (e) {
  console.error("Building lambda failed: ", e);
}
