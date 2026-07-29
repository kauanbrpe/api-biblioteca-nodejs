import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(200),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
});

export const updateUserSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    email: z.string().email("E-mail inválido").optional(),
});

// O service espera email + password juntos (updatePassword(email, { password }, userId))
export const updatePasswordSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export const updateRoleSchema = z.object({
    role: z.enum(["USER", "ADMIN"]),
});

export const updateStatusSchema = z.object({
    status: z.enum(["ACTIVE", "DISABLED"]),
});