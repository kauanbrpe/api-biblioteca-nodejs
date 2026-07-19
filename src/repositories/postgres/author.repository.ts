import { PrismaClient, Author } from "../../generated/prisma";

const prisma = new PrismaClient();

export class AuthorRepository {
    async findAll(): Promise<Author[]> {
        return prisma.author.findMany();
    }

    async findById(id: number): Promise<Author | null> {
        return prisma.author.findUnique({
            where: { id },
        });
    }

    async create(data: Pick<Author, "name" | "bio" | "birthDate" | "nationality">): Promise<Author> {
        return prisma.author.create( { data } );
    }

    async update(id: number, data: Partial<Pick<Author, "name" | "bio" | "birthDate" | "nationality">>): Promise<Author> {
        return prisma.author.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Author> {
        return prisma.author.delete({
            where: { id },
        });
    }
}

export const authorRepository = new AuthorRepository();