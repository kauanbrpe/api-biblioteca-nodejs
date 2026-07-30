import { Book } from "../../generated/prisma";
import { prisma } from "../../config/prisma";


export class BookRepository {
    async findAll(params?: { skip?: number; take?: number }): Promise<Book[]> {
        return prisma.book.findMany({
            skip: params?.skip,
            take: params?.take,
        });
    }

    async count(): Promise<number> {
        return prisma.book.count();
    }

    async findById(id: number): Promise<Book | null> {
        return prisma.book.findUnique({
            where: { id },
        });
    }

    async findByIsbn(isbn: string): Promise<Book | null> {
        return prisma.book.findUnique({
            where: { isbn }
        })
    }

    async findByAuthorId(authorId: number): Promise<Book[]> {
        return prisma.book.findMany({
            where: { authorId },
        })
    }

    async create(data: Pick<Book, "title" | "isbn" | "publishedYear" | "totalCopies" | "avaiableCopies" | "authorId">): Promise<Book> {
        return prisma.book.create( { data } );
    }

    async update(id: number, data: Partial<Pick<Book, "title" | "isbn" | "publishedYear" | "totalCopies" | "avaiableCopies" | "authorId">>): Promise<Book> {
        return prisma.book.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Book> {
        return prisma.book.delete({
            where: { id },
        });
    }

    async countByAuthorId(authorId: number): Promise<number> {
        return prisma.book.count({
            where: { authorId },
        });
    }
}

export const bookRepository = new BookRepository();
