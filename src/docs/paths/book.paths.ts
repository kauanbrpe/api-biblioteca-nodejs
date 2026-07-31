import { z } from "zod";
import { createBookSchema, updateBookSchema } from "../../schemas/book.schema";

const bookResponse = z.object({
    id: z.number(),
    title: z.string(),
    isbn: z.string(),
    publishedYear: z.number(),
    totalCopies: z.number(),
    avaiableCopies: z.number(),
    authorId: z.number(),
    createdAt: z.string(),
}).meta({ id: "Book" });

const idParam = z.object({ id: z.coerce.number().int().positive().meta({ example: 1 }) });
const isbnParam = z.object({ isbn: z.string().meta({ example: "9788535914849" }) });
const authorIdParam = z.object({ authorId: z.coerce.number().int().positive().meta({ example: 1 }) });

export const bookPaths = {
    "/books": {
        get: {
            tags: ["Books"],
            summary: "Lista todos os livros (paginado)",
            security: [{ bearerAuth: [] }],
            responses: {
                "200": { description: "Lista de livros", content: { "application/json": { schema: z.array(bookResponse) } } },
            },
        },
        post: {
            tags: ["Books"],
            summary: "Cria um novo livro (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestBody: { content: { "application/json": { schema: createBookSchema.meta({ id: "CreateBook" }) } } },
            responses: {
                "201": { description: "Livro criado", content: { "application/json": { schema: bookResponse } } },
                "409": { description: "ISBN já cadastrado" },
            },
        },
    },
    "/books/{id}": {
        get: {
            tags: ["Books"],
            summary: "Busca um livro pelo ID",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "200": { description: "Livro encontrado", content: { "application/json": { schema: bookResponse } } },
                "404": { description: "Livro não encontrado" },
            },
        },
        put: {
            tags: ["Books"],
            summary: "Atualiza um livro (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            requestBody: { content: { "application/json": { schema: updateBookSchema.meta({ id: "UpdateBook" }) } } },
            responses: {
                "200": { description: "Livro atualizado", content: { "application/json": { schema: bookResponse } } },
                "404": { description: "Livro não encontrado" },
            },
        },
        delete: {
            tags: ["Books"],
            summary: "Remove um livro (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "204": { description: "Livro removido com sucesso" },
                "404": { description: "Livro não encontrado" },
            },
        },
    },
    "/books/isbn/{isbn}": {
        get: {
            tags: ["Books"],
            summary: "Busca um livro pelo ISBN",
            security: [{ bearerAuth: [] }],
            requestParams: { path: isbnParam },
            responses: {
                "200": { description: "Livro encontrado", content: { "application/json": { schema: bookResponse } } },
                "404": { description: "Livro não encontrado" },
            },
        },
    },
    "/books/author/{authorId}": {
        get: {
            tags: ["Books"],
            summary: "Lista os livros de um autor",
            security: [{ bearerAuth: [] }],
            requestParams: { path: authorIdParam },
            responses: {
                "200": { description: "Livros do autor", content: { "application/json": { schema: z.array(bookResponse) } } },
                "404": { description: "Autor não encontrado" },
            },
        },
    },
};