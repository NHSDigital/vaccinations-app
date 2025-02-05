import * as esbuild from 'esbuild';
// import * as PackageJson from './package.json' with { type: "json" };

const sharedConfig = {
  entryPoints: ["src/app.ts"],
  bundle: true,
  minify: false,
  external: ["express", "pug"]
};

await esbuild.build({
  ...sharedConfig,
  platform: 'node', // for CJS
  outfile: "dist/bundle.js",
  format: "esm",
});
