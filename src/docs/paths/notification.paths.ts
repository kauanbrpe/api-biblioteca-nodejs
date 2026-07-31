import { z } from "zod";
import { createNotificationSchema } from "../../schemas/notification.schema";

const notificationResponse = z.object({
    _id: z.string(),
    userId: z.number(),
    type: z.enum(["LOAN_DUE", "LOAN_OVERDUE", "RESERVATION_AVAILABLE"]),
    message: z.string(),
    read: z.boolean(),
    createdAt: z.string(),
}).meta({ id: "Notification" });

const idParam = z.object({ id: z.string().meta({ example: "6a6a865bb7f0183d8b22a29b" }) });
const userIdParam = z.object({ userId: z.coerce.number().int().positive().meta({ example: 1 }) });

export const notificationPaths = {
    "/notifications": {
        get: {
            tags: ["Notifications"],
            summary: "Lista todas as notificações (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            responses: {
                "200": { description: "Lista de notificações", content: { "application/json": { schema: z.array(notificationResponse) } } },
            },
        },
        post: {
            tags: ["Notifications"],
            summary: "Cria uma nova notificação (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestBody: { content: { "application/json": { schema: createNotificationSchema.meta({ id: "CreateNotification" }) } } },
            responses: {
                "201": { description: "Notificação criada", content: { "application/json": { schema: notificationResponse } } },
            },
        },
    },
    "/notifications/{id}": {
        get: {
            tags: ["Notifications"],
            summary: "Busca uma notificação pelo ID (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "200": { description: "Notificação encontrada", content: { "application/json": { schema: notificationResponse } } },
                "404": { description: "Notificação não encontrada" },
            },
        },
        put: {
            tags: ["Notifications"],
            summary: "Marca uma notificação como lida (somente o dono)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "200": { description: "Notificação marcada como lida", content: { "application/json": { schema: notificationResponse } } },
                "403": { description: "Você não tem permissão para acessar esta notificação" },
                "404": { description: "Notificação não encontrada" },
            },
        },
        delete: {
            tags: ["Notifications"],
            summary: "Remove uma notificação (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: idParam },
            responses: {
                "204": { description: "Notificação removida com sucesso" },
                "404": { description: "Notificação não encontrada" },
            },
        },
    },
    "/notifications/user/{userId}": {
        get: {
            tags: ["Notifications"],
            summary: "Lista as notificações de um usuário (somente ADMIN)",
            security: [{ bearerAuth: [] }],
            requestParams: { path: userIdParam },
            responses: {
                "200": { description: "Notificações do usuário", content: { "application/json": { schema: z.array(notificationResponse) } } },
                "404": { description: "Usuário não encontrado" },
            },
        },
    },
};