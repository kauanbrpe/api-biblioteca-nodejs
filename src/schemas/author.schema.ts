import { z } from "zod";

export const createAuthorSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(200),
    bio: z.string().max(2000).optional(),
    birthDate: z.coerce.date().max(new Date(), "Data de nascimento não pode ser no futuro").optional(),
    nationality: z.string().max(100).optional(),
});

export const updateAuthorSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    bio: z.string().max(2000).optional(),
    birthDate: z.coerce.date().max(new Date()).optional(),
    nationality: z.string().max(100).optional(),
});
