const { build } = require("esbuild");
const { dependencies } = require('./package.json')

const sharedConfig = {
  entryPoints: ["src/app.ts"],
  bundle: true,
  minify: true,
  external: Object.keys(dependencies)
};

build({
  ...sharedConfig,
  platform: 'node', // for CJS
  outfile: "dist/app.js",
});