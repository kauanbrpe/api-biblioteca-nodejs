import { PrismaClient, Loan, statusEnum } from "../../generated/prisma";

const prisma = new PrismaClient();

export class LoanRepository {
    async findAll(): Promise<Loan[]> {
        return prisma.loan.findMany();
    }

    async findById(id: number): Promise<Loan | null> {
        return prisma.loan.findUnique({
            where: { id },
        });
    }

    async findByUserId(userId: number): Promise<Loan[]> {
        return prisma.loan.findMany({
            where: { userId },
        });
    }

    async findByBookId(bookId: number): Promise<Loan[]> {
        return prisma.loan.findMany({
            where: { bookId },
        });
    }

    async create(data: Pick<Loan, "userId" | "bookId" | "loanDate" | "dueDate"> & { status?: statusEnum }): Promise<Loan> {
        return prisma.loan.create( { data } );
    }

    async update(id: number, data: Partial<Pick<Loan, "userId" | "bookId" | "loanDate" | "dueDate" | "returnDate">> & { status?: statusEnum}): Promise<Loan> {
        return prisma.loan.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Loan> {
        return prisma.loan.delete({
            where: { id },
        });
    }

    async countByUserId(userId: number): Promise<number> {
        return prisma.loan.count({
            where: { userId },
        });
    }

    async countByBookId(bookId: number): Promise<number> {
        return prisma.loan.count({
            where: { bookId },
        });
    }
}

export const loanRepository = new LoanRepository();