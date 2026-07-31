import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src"],
    format: ["cjs"],
    target: "node20",
    clean: true,
    // Não tentar processar/empacotar o client gerado do Prisma —
    // ele contém arquivos .wasm e .prisma que o esbuild não sabe interpretar.
    external: [/generated\/prisma/],
});