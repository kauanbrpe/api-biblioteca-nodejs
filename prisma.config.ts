import "dotenv/config";
import { defineConfig, env } from "prisma/config"; // Adicionado o helper env

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // provider: "postgresql", // Descomente e defina se necessário
    url: env("DATABASE_URL"), // Alterado para o helper nativo do Prisma v7
  },
});
