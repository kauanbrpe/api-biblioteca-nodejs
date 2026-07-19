import { PrismaClient, Book } from "../../generated/prisma";

const prisma = new PrismaClient();

export class BookRepository {
    async findAll(): Promise<Book[]> {
        return prisma.book.findMany();
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