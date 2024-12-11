import { defineConfig } from "tsup";

const basics: any = {
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  minify: true,
};

export default defineConfig([{
  name: "FATE",
  entry: ["src/index.ts"],
  ...basics,
}, {
  name: "CRATES",
  entryPoints: [
    "assert",
    "cache",
    "error",
    "events",
    "fetch",
    "fs",
    "path",
    "rate-limiter",
  ].map((name: string) => `src/crates/${name}/index.ts`),
  ...basics,
}, {
  name: "CRATES/REACT",
  entry: ["src/crates/react/index.tsx"],
  ...basics,
}]);
