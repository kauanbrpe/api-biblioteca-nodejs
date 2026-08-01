import { loanRepository } from "../repositories/postgres/loan.repository";
import { AppError } from "../utils/AppError";
import { parsePagination, buildPaginatedResult } from "../utils/paginate";
import { activityLogService } from "./activity.log.service";
import { ActionType } from "../models/activity.log.model";
import { Loan, statusLoanEnum } from "@prisma/client";
import { bookRepository } from "../repositories/postgres/book.repository";
import { userRepository } from "../repositories/postgres/user.repository";

export class LoanService {
    async getAll(query: { page?: string; limit?: string}) {
        const { page, limit, skip } = parsePagination(query);

        const loans = await loanRepository.findAll( { skip, take: limit });
        const totalItems = await loanRepository.count();

        return buildPaginatedResult(loans, { page, limit, totalItems });
    }

    async getById(id: number) {
        const loan = await loanRepository.findById(id);

        if (!loan) {
            throw AppError.notFound('Empréstimo não encontrado');
        }

        return loan;
    }

    async getByUserId(userId: number) {
        const userExists = await userRepository.findById(userId);

        if (!userExists) {
            throw AppError.notFound('Usuário não existe/encontrado');
        }

        return loanRepository.findByUserId(userId);
    }

    async getByBookId(bookId: number) {
        const bookExists = await bookRepository.findById(bookId);

        if (!bookExists) {
            throw AppError.notFound('Livro não existe/encontrado');
        }

        return loanRepository.findByBookId(bookId);
    }

    async create(data: Pick<Loan, "userId" | "bookId" | "loanDate" | "dueDate">, userId?: number) {
        await this.getByUserId(data.userId);

        const book = await bookRepository.findById(data.bookId);
        if (!book) {
            throw AppError.notFound('Livro não encontrado');
        }

        if (book.avaiableCopies <= 0) {
            throw AppError.badRequest('Não há cópias dispoíveis deste livro');
        }

        await bookRepository.update(book.id, {
            avaiableCopies: book.avaiableCopies - 1
        });

        const loan = await loanRepository.create(data);

        await activityLogService.log({
            userId,
            action: ActionType.LOAN_CREATED,
            entity: "Loan",
            entityId: loan.id,
        });

        return loan;
    }

    async updateLoan(id: number, data: Partial<Pick<Loan, "userId" | "bookId" | "loanDate" | "dueDate">>, userId?: number) {
        await this.getById(id);

        if (data.userId) {
            await this.getByUserId(data.userId);
        }

        if (data.bookId) {
            await this.getByBookId(data.bookId);
        }

        const loan = await loanRepository.update(id, data);

        await activityLogService.log({
            userId,
            action: ActionType.LOAN_UPDATED,
            entity: "Loan",
            entityId: loan.id,
            metadata: data,
        });

        return loan;
    }

    async returnLoanUpdate(id: number, userId?: number) {
        const existingLoan = await this.getById(id);

        if (existingLoan.status === statusLoanEnum.RETURNED) {
            throw AppError.badRequest('Este empréstimo já foi devolvido');
        }

        const loan = await loanRepository.update(id, {
            returnDate: new Date(),
            status: statusLoanEnum.RETURNED
        });

        const book = await bookRepository.findById(loan.bookId);
        if (book) {
            await bookRepository.update(book.id, {
                avaiableCopies: book.avaiableCopies + 1
            });
        }

        await activityLogService.log({
            userId,
            action: ActionType.LOAN_RETURNED,
            entity: "Loan",
            entityId: loan.id,
        });

        return loan;
    }

    async correctReturnDate(id: number, returnDate: Date, userId?: number) {
        const loan = await this.getById(id);

        if (loan.status !== statusLoanEnum.RETURNED) {
            throw AppError.badRequest('Só é possível corrigir a data de um empréstimo já devolvido');
        }

        const updatedLoan = await loanRepository.update(id, { returnDate });

        await activityLogService.log({
            userId,
            action: ActionType.LOAN_RETURN_DATE_CORRECTED,
            entity: "Loan",
            entityId: updatedLoan.id,
            metadata: { correctedReturnDate: returnDate },
        });

        return updatedLoan;
    }

    async overdueLoan(id: number) {
        const loan = await this.getById(id);

        if (loan.status === statusLoanEnum.RETURNED) {
            throw AppError.badRequest('Este empréstimo já foi devolvido.');
        }

        if (loan.status === statusLoanEnum.OVERDUE) {
            return loan;
        }

        const now = new Date();
        const isOverdue = now > new Date(loan.dueDate);

        if (!isOverdue) {
            throw AppError.badRequest('Este empréstimo ainda está dentro do prazo de devolver o livro');
        }

        const updatedLoan = await loanRepository.update(id, {
            status: statusLoanEnum.OVERDUE,
        });

        await activityLogService.log({
            action: ActionType.LOAN_OVERDUE,
            entity: "Loan",
            entityId: updatedLoan.id,
            metadata: { reason: "Marcado como atrasado" }
        });

        return updatedLoan;
    }

    async delete(id: number, userId?: number) {
        await this.getById(id);

        const loan = await loanRepository.delete(id);

        await activityLogService.log({
            userId,
            action: ActionType.LOAN_DELETED,
            entity: "Loan",
            entityId: id
        });

        return loan;
    }
}

export const loanService = new LoanService();