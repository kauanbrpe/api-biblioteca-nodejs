import { z } from "zod";
import { createAuthorSchema, updateAuthorSchema } from "../../schemas/author.schema";

const authorResponse = z.object({
    id: z.number(),
    name: z.string(),
    bio: z.string().nullable(),
    birthDate: z.string().nullable(),
    nationality: z.string().nullable(),
}).meta({ id: "Author" });

const idParam = z.object({
    id: z.coerce.number().int().positive().meta({ example: 1 }),
});

export const authorPaths = {
    "/authors": {
        get: {
            tags: ["Authors"],
            summary: "Lista todos os autores (paginado)",
            security: [{ bearerAuth: [] }],
            responses: {
                "200": {
                    description: "Lista de autores",
                    content: { "application/json": { schema: z.array(authorResponse) } },
                },
            },
        },
        post: {
            tags: ["Authors"],
            summary: "Cria um novo autor (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: { "application/json": { schema: createAuthorSchema.meta({ id: "CreateAuthor" }) } },
            },
            responses: {
                "201": {
                    description: "Autor criado",
                    content: { "application/json": { schema: authorResponse } },
                },
                "403": { description: "Acesso negado — requer ADMIN" },
            },
        },
    },
    "/authors/{id}": {
        get: {
            tags: ["Authors"],
            summary: "Busca um autor pelo ID",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "200": {
                    description: "Autor encontrado",
                    content: { "application/json": { schema: authorResponse } },
                },
                "404": { description: "Autor não encontrado" },
            },
        },
        put: {
            tags: ["Authors"],
            summary: "Atualiza um autor (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            requestBody: {
                content: { "application/json": { schema: updateAuthorSchema.meta({ id: "UpdateAuthor" }) } },
            },
            responses: {
                "200": {
                    description: "Autor atualizado",
                    content: { "application/json": { schema: authorResponse } },
                },
                "404": { description: "Autor não encontrado" },
            },
        },
        delete: {
            tags: ["Authors"],
            summary: "Remove um autor (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "204": { description: "Autor removido com sucesso" },
                "404": { description: "Autor não encontrado" },
            },
        },
    },
};