import { User, roleEnum, statusUserEnum } from "../../generated/prisma";
import { prisma } from "../../config/prisma";

export class UserRepository {
    async findAll(params?: { skip?: number; take?: number }): Promise<User[]> {
        return prisma.user.findMany({
            skip: params?.skip,
            take: params?.take,
        });
    }

    async count(): Promise<number> {
        return prisma.user.count();
    }

    async findById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async create(data: Pick<User, "name" | "email" | "password">): Promise<User> {
        return prisma.user.create( { data } );
    }

    async update(id: number, data: Partial<Pick<User, "name" | "email">> & { role?: roleEnum } & ( { status?: statusUserEnum })): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async updatePassword(email: string, data: Pick<User, "password">): Promise<User> {
        return prisma.user.update({
            where: { email },
            data,
        })
    }

    async delete(id: number): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    }
}

export const userRepository = new UserRepository();
