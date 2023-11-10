await Bun.build({
  entrypoints: [
    "./src/index.ts"
  ],
  root: "src",
  target: "node",
  format: "esm",
  outdir: "dist"
});

console.log("Done.");