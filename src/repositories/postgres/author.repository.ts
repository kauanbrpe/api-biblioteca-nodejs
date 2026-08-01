import { Author } from "@prisma/client";
import { prisma } from "../../config/prisma"; 

export class AuthorRepository {
    async findAll(params?: { skip?: number; take?: number }): Promise<Author[]> {
        return prisma.author.findMany({
            skip: params?.skip,
            take: params?.take,
        });
    }

    async count(): Promise<number> {
        return prisma.author.count();
    }

    async findById(id: number): Promise<Author | null> {
        return prisma.author.findUnique({
            where: { id },
        });
    }

    async create(data: Pick<Author, "name"> & Partial<Pick<Author, "bio" | "birthDate" | "nationality">>): Promise<Author> {
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
