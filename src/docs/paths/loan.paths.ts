import { z } from "zod";
import { createLoanSchema, updateLoanSchema, correctReturnDateSchema } from "../../schemas/loan.schema";

const loanResponse = z.object({
    id: z.number(),
    userId: z.number(),
    bookId: z.number(),
    loanDate: z.string(),
    dueDate: z.string(),
    returnDate: z.string().nullable(),
    status: z.enum(["ACTIVE", "RETURNED", "OVERDUE"]),
}).meta({ id: "Loan" });

const idParam = z.object({ id: z.coerce.number().int().positive().meta({ example: 1 }) });
const userIdParam = z.object({ userId: z.coerce.number().int().positive().meta({ example: 1 }) });
const bookIdParam = z.object({ bookId: z.coerce.number().int().positive().meta({ example: 1 }) });

export const loanPaths = {
    "/loans": {
        get: {
            tags: ["Loans"],
            summary: "Lista todos os empréstimos (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            responses: {
                "200": { description: "Lista de empréstimos", content: { "application/json": { schema: z.array(loanResponse) } } },
            },
        },
        post: {
            tags: ["Loans"],
            summary: "Cria um novo empréstimo",
            security: [{ bearerAuth: [] }],
            requestBody: { content: { "application/json": { schema: createLoanSchema.meta({ id: "CreateLoan" }) } } },
            responses: {
                "201": { description: "Empréstimo criado", content: { "application/json": { schema: loanResponse } } },
                "400": { description: "Não há cópias disponíveis deste livro" },
            },
        },
    },
    "/loans/{id}": {
        get: {
            tags: ["Loans"],
            summary: "Busca um empréstimo pelo ID (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "200": { description: "Empréstimo encontrado", content: { "application/json": { schema: loanResponse } } },
                "404": { description: "Empréstimo não encontrado" },
            },
        },
        put: {
            tags: ["Loans"],
            summary: "Atualiza dados de um empréstimo",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            requestBody: { content: { "application/json": { schema: updateLoanSchema.meta({ id: "UpdateLoan" }) } } },
            responses: {
                "200": { description: "Empréstimo atualizado", content: { "application/json": { schema: loanResponse } } },
                "404": { description: "Empréstimo não encontrado" },
            },
        },
        delete: {
            tags: ["Loans"],
            summary: "Remove um empréstimo (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "204": { description: "Empréstimo removido com sucesso" },
                "404": { description: "Empréstimo não encontrado" },
            },
        },
    },
    "/loans/user/{userId}": {
        get: {
            tags: ["Loans"],
            summary: "Lista os empréstimos de um usuário (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: userIdParam },
            responses: {
                "200": { description: "Empréstimos do usuário", content: { "application/json": { schema: z.array(loanResponse) } } },
                "404": { description: "Usuário não encontrado" },
            },
        },
    },
    "/loans/book/{bookId}": {
        get: {
            tags: ["Loans"],
            summary: "Lista os empréstimos de um livro (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: bookIdParam },
            responses: {
                "200": { description: "Empréstimos do livro", content: { "application/json": { schema: z.array(loanResponse) } } },
                "404": { description: "Livro não encontrado" },
            },
        },
    },
    "/loans/{id}/return": {
        post: {
            tags: ["Loans"],
            summary: "Registra a devolução do livro (data atual do servidor)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "200": { description: "Empréstimo devolvido", content: { "application/json": { schema: loanResponse } } },
                "400": { description: "Este empréstimo já foi devolvido" },
            },
        },
    },
    "/loans/{id}/check-overdue": {
        post: {
            tags: ["Loans"],
            summary: "Verifica e marca o empréstimo como atrasado, se aplicável",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "200": { description: "Status atualizado (ou já estava atrasado)", content: { "application/json": { schema: loanResponse } } },
                "400": { description: "Empréstimo ainda dentro do prazo ou já devolvido" },
            },
        },
    },
    "/loans/{id}/return-date": {
        patch: {
            tags: ["Loans"],
            summary: "Corrige a data de devolução de um empréstimo já devolvido (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            requestBody: { content: { "application/json": { schema: correctReturnDateSchema.meta({ id: "CorrectReturnDate" }) } } },
            responses: {
                "200": { description: "Data corrigida", content: { "application/json": { schema: loanResponse } } },
                "400": { description: "Só é possível corrigir a data de um empréstimo já devolvido" },
            },
        },
    },
};