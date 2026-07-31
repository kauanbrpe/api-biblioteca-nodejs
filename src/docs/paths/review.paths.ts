import { z } from "zod";
import { createReviewSchema, updateReviewSchema } from "../../schemas/review.schema";

const reviewResponse = z.object({
    _id: z.string(),
    bookId: z.number(),
    userId: z.number(),
    rating: z.number(),
    comment: z.string().optional(),
    createdAt: z.string(),
}).meta({ id: "Review" });

const idParam = z.object({ id: z.string().meta({ example: "6a6a865bb7f0183d8b22a29b" }) });
const userIdParam = z.object({ userId: z.coerce.number().int().positive().meta({ example: 1 }) });
const bookIdParam = z.object({ bookId: z.coerce.number().int().positive().meta({ example: 1 }) });

export const reviewPaths = {
    "/reviews": {
        get: {
            tags: ["Reviews"],
            summary: "Lista todas as avaliações (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            responses: {
                "200": { description: "Lista de avaliações", content: { "application/json": { schema: z.array(reviewResponse) } } },
            },
        },
        post: {
            tags: ["Reviews"],
            summary: "Cria uma nova avaliação (userId sempre vem do token)",
            security: [{ bearerAuth: [] }],
            requestBody: { content: { "application/json": { schema: createReviewSchema.meta({ id: "CreateReview" }) } } },
            responses: {
                "201": { description: "Avaliação criada", content: { "application/json": { schema: reviewResponse } } },
            },
        },
    },
    "/reviews/{id}": {
        get: {
            tags: ["Reviews"],
            summary: "Busca uma avaliação pelo ID",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "200": { description: "Avaliação encontrada", content: { "application/json": { schema: reviewResponse } } },
                "404": { description: "Avaliação não encontrada" },
            },
        },
        put: {
            tags: ["Reviews"],
            summary: "Atualiza uma avaliação (somente o dono)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            requestBody: { content: { "application/json": { schema: updateReviewSchema.meta({ id: "UpdateReview" }) } } },
            responses: {
                "200": { description: "Avaliação atualizada", content: { "application/json": { schema: reviewResponse } } },
                "403": { description: "Você não tem permissão para editar esta avaliação" },
                "404": { description: "Avaliação não encontrada" },
            },
        },
        delete: {
            tags: ["Reviews"],
            summary: "Remove uma avaliação (dono ou ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "204": { description: "Avaliação removida com sucesso" },
                "403": { description: "Você não tem permissão para excluir esta avaliação" },
                "404": { description: "Avaliação não encontrada" },
            },
        },
    },
    "/reviews/user/{userId}": {
        get: {
            tags: ["Reviews"],
            summary: "Lista as avaliações de um usuário (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: userIdParam },
            responses: {
                "200": { description: "Avaliações do usuário", content: { "application/json": { schema: z.array(reviewResponse) } } },
                "404": { description: "Usuário não encontrado" },
            },
        },
    },
    "/reviews/book/{bookId}": {
        get: {
            tags: ["Reviews"],
            summary: "Lista as avaliações de um livro",
            security: [{ bearerAuth: [] }],
            requestParams: { path: bookIdParam },
            responses: {
                "200": { description: "Avaliações do livro", content: { "application/json": { schema: z.array(reviewResponse) } } },
                "404": { description: "Livro não encontrado" },
            },
        },
    },
};