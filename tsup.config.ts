import { defineConfig } from "tsup";

export default defineConfig({
    name: "FATE",
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
});
