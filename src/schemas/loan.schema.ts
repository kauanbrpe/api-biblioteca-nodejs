import { z } from "zod";

export const createLoanSchema = z.object({
    userId: z.coerce.number().int().positive(),
    bookId: z.coerce.number().int().positive(),
    loanDate: z.coerce.date(),
    dueDate: z.coerce.date(),
}).refine((data) => data.dueDate > data.loanDate, {
    message: "A data de devolução deve ser posterior à data do empréstimo",
    path: ["dueDate"],
});

export const updateLoanSchema = z.object({
    userId: z.coerce.number().int().positive().optional(),
    bookId: z.coerce.number().int().positive().optional(),
    loanDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
});


export const correctReturnDateSchema = z.object({
    returnDate: z.coerce.date({ error: "A data de devolução é obrigatória" }),
});