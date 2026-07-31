import { z } from "zod";
import {
    createUserSchema,
    loginSchema,
    updateUserSchema,
    updatePasswordSchema,
    updateRoleSchema,
    updateStatusSchema,
} from "../../schemas/user.schema";

const userResponse = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    role: z.enum(["USER", "ADMIN"]),
    status: z.enum(["ACTIVE", "DISABLED"]),
    createdAt: z.string(),
    updatedAt: z.string(),
}).meta({ id: "User" });

const loginResponse = z.object({
    user: userResponse,
    token: z.string(),
}).meta({ id: "LoginResponse" });

const idParam = z.object({ id: z.coerce.number().int().positive().meta({ example: 1 }) });
const emailParam = z.object({ email: z.string().email().meta({ example: "usuario@exemplo.com" }) });

export const userPaths = {
    "/users": {
        get: {
            tags: ["Users"],
            summary: "Lista todos os usuários",
            security: [{ bearerAuth: [] }],
            responses: {
                "200": { description: "Lista de usuários", content: { "application/json": { schema: z.array(userResponse) } } },
            },
        },
        post: {
            tags: ["Users"],
            summary: "Cadastra um novo usuário",
            requestBody: { content: { "application/json": { schema: createUserSchema.meta({ id: "CreateUser" }) } } },
            responses: {
                "201": { description: "Usuário criado", content: { "application/json": { schema: userResponse } } },
                "409": { description: "E-mail já está em uso" },
            },
        },
    },
    "/users/login": {
        post: {
            tags: ["Users"],
            summary: "Autentica um usuário e retorna um token JWT",
            requestBody: { content: { "application/json": { schema: loginSchema.meta({ id: "Login" }) } } },
            responses: {
                "200": { description: "Login realizado com sucesso", content: { "application/json": { schema: loginResponse } } },
                "401": { description: "E-mail ou senha inválidos" },
                "403": { description: "Conta desativada" },
            },
        },
    },
    "/users/{id}": {
        get: {
            tags: ["Users"],
            summary: "Busca um usuário pelo ID (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "200": { description: "Usuário encontrado", content: { "application/json": { schema: userResponse } } },
                "404": { description: "Usuário não encontrado" },
            },
        },
        put: {
            tags: ["Users"],
            summary: "Atualiza dados de um usuário (dono ou ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            requestBody: { content: { "application/json": { schema: updateUserSchema.meta({ id: "UpdateUser" }) } } },
            responses: {
                "200": { description: "Usuário atualizado", content: { "application/json": { schema: userResponse } } },
                "403": { description: "Você não tem permissão para realizar esta ação" },
                "404": { description: "Usuário não encontrado" },
            },
        },
        delete: {
            tags: ["Users"],
            summary: "Remove um usuário (dono ou ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "204": { description: "Usuário removido com sucesso" },
                "403": { description: "Você não tem permissão para realizar esta ação" },
                "404": { description: "Usuário não encontrado" },
            },
        },
    },
    "/users/email/{email}": {
        get: {
            tags: ["Users"],
            summary: "Busca um usuário pelo e-mail (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: emailParam },
            responses: {
                "200": { description: "Usuário encontrado", content: { "application/json": { schema: userResponse } } },
                "404": { description: "Usuário não encontrado" },
            },
        },
    },
    "/users/{id}/role": {
        patch: {
            tags: ["Users"],
            summary: "Altera o cargo (role) de um usuário (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            requestBody: { content: { "application/json": { schema: updateRoleSchema.meta({ id: "UpdateRole" }) } } },
            responses: {
                "200": { description: "Cargo atualizado", content: { "application/json": { schema: userResponse } } },
                "404": { description: "Usuário não encontrado" },
            },
        },
    },
    "/users/{id}/status": {
        patch: {
            tags: ["Users"],
            summary: "Altera o status (ativo/desativado) de um usuário (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            requestBody: { content: { "application/json": { schema: updateStatusSchema.meta({ id: "UpdateStatus" }) } } },
            responses: {
                "200": { description: "Status atualizado", content: { "application/json": { schema: userResponse } } },
                "404": { description: "Usuário não encontrado" },
            },
        },
    },
    "/users/password": {
        patch: {
            tags: ["Users"],
            summary: "Altera a senha de um usuário (dono ou ADMIN)",
            security: [{ bearerAuth: [] }],
            requestBody: { content: { "application/json": { schema: updatePasswordSchema.meta({ id: "UpdatePassword" }) } } },
            responses: {
                "200": { description: "Senha atualizada", content: { "application/json": { schema: userResponse } } },
                "403": { description: "Você não tem permissão para realizar esta ação" },
            },
        },
    },
};