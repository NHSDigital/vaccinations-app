import * as esbuild from "esbuild";
import CopyPluginPackage from "@sprout2000/esbuild-copy-plugin";

const { copyPlugin } = CopyPluginPackage;

import PackageJson from "./package.json" with { type: "json" };

const sharedConfig = {
  entryPoints: ["src/app.ts"],
  bundle: true,
  minify: false,
  external: Object.keys(PackageJson.dependencies),
};

await esbuild
  .build({
    ...sharedConfig,
    platform: "node",
    outfile: "dist/bundle.js",
    format: "esm",
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
  .catch(() => process.exit(1));
