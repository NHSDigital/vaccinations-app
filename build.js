import * as esbuild from 'esbuild';
import PackageJson from './package.json' with { type: "json" };

const sharedConfig = {
  entryPoints: ["src/app.ts"],
  bundle: true,
  minify: false,
  external: Object.keys(PackageJson.dependencies),
};

await esbuild.build({
  ...sharedConfig,
  platform: 'node', // for CJS
  outfile: "dist/bundle.js",
  format: "esm",
});
