import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src"],
    format: ["cjs"],
    target: "node20",  // garante que o código compilado usa recursos compatíveis com Node 20+ (o Render roda Node 24, então isso é seguro)
    clean: true,        // limpa a pasta dist/ antes de cada build, evitando arquivos antigos "fantasma" acumulando
});