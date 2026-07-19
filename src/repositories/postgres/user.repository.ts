import { PrismaClient, User, isAdmin } from "../../generated/prisma";

const prisma = new PrismaClient();

export class UserRepository {
    async findAll(): Promise<User[]> {
        return prisma.user.findMany();
    }

    async findById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async create(data: Pick<User, "name" | "email" | "password">): Promise<User> {
        return prisma.user.create( { data } );
    }

    async update(id: number, data: Partial<Pick<User, "name" | "email" | "password">> & { status?: isAdmin }): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    }
}

export const userRepository = new UserRepository();