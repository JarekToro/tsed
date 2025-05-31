import {defineConfig} from "vite";
import {join} from "node:path";
import {extname, relative} from "path";
import {fileURLToPath} from "node:url";
import {globbySync} from "globby";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    assetsInlineLimit: 0,
    sourcemap: true,
    outDir: "lib/browser",
    lib: {
      entry: join(import.meta.dirname, "src/common/index.ts"),
      formats: ["es"]
    },
    rollupOptions: {
      external: [/node_modules\/(.*)/, /^@tsed\//],
      input: Object.fromEntries(
        globbySync("src/common/**/*.ts", {
          ignore: [
            "**/*.spec.{ts,tsx}",
            "**/*.stories.{ts,tsx}",
            "**/__mocks__/**",
            "**/__mock__/**",
            "**/interfaces/**"
          ]
        }).map((file) => [
          // The name of the entry point
          // lib/nested/foo.ts becomes nested/foo
          relative("src", file.slice(0, file.length - extname(file).length)),
          // The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "chunks/[name].js",
        entryFileNames: "[name].js"
      }
    }
  }
});
