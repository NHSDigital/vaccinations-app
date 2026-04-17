const config = {
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "src/content.ts",
      output: {
        entryFileNames: "bundle.js",
      },
    },
  },
};

export default config;
