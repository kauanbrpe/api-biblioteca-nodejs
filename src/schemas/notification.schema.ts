import { z } from "zod";

export const createNotificationSchema = z.object({
    userId: z.coerce.number().int().positive(),
    type: z.enum(["LOAN_DUE", "LOAN_OVERDUE", "RESERVATION_AVAILABLE"]),
    message: z.string().min(1, "Mensagem é obrigatória").max(500),
});
