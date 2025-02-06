import * as esbuild from "esbuild";
import CopyPluginPackage from "@sprout2000/esbuild-copy-plugin";

const { copyPlugin } = CopyPluginPackage;

import PackageJson from "./package.json" with { type: "json" };

const sharedConfig = {
  entryPoints: ["src/app.ts", "src/server.ts" ],
  bundle: true,
  minify: false,
  external: Object.keys(PackageJson.dependencies),
};

await esbuild
  .build({
    ...sharedConfig,
    platform: "node",
    outdir: "dist",
    format: "esm",
    logLevel: "info",
    plugins: [
      copyPlugin({
        src: "./src/views",
        dest: "./dist/views",
      }),
      copyPlugin({
        src: "./src/public",
        dest: "./dist/public",
      }),
    ],
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);}
  );
