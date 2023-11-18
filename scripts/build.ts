import dts from "bun-plugin-dts";

await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  format: "esm",
  splitting: true,
  external: [
    "pgnify"
  ],
  plugins: [
    dts()
  ]
});