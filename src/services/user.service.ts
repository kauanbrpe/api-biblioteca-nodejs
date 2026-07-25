import { userRepository } from "../repositories/postgres/user.repository";
import { AppError } from "../utils/AppError";
import { parsePagination, buildPaginatedResult } from "../utils/paginate";
import { activityLogService } from "./activity.log.service";
import { ActionType } from "../models/activity.log.model";
import { User, roleEnum, statusUserEnum } from "../generated/prisma";
import bcrypt from 'bcrypt';

export class UserService {
    async getAll(query: { page?: string; limit?: string}) {
        const { page, limit, skip } = parsePagination(query);

        const users = await userRepository.findAll( { skip, take: limit });
        const totalItems = await userRepository.count();

        return buildPaginatedResult(users, { page, limit, totalItems });
    }

    async getById(id: number) {
        const user = await userRepository.findById(id);

        if (!user) {
            throw AppError.notFound('Usuário não encontrado');
        }

        return user;
    }

    async getByEmail(email: string) {
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw AppError.notFound('Email não encontrado');
        }

        return user; 
    }

    async create(data: Pick<User, "name" | "email" | "password">) {
        const existing = await userRepository.findByEmail(data.email);
        if(existing) {
            throw AppError.conflict('Este e-mail já está em uso');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await userRepository.create({
            ...data,
            password: hashedPassword
        });

        await activityLogService.log({
            action: ActionType.USER_REGISTERED,
            entity: "User",
            entityId: user.id
        });

        return user;
    }

    async update(id: number, data: Partial<Pick<User, "name" | "email">>, userId?: number) {
        await this.getById(id);

        if (data.email) {
            const existing = await userRepository.findByEmail(data.email);
            if(existing && existing.id !== id) {
                throw AppError.conflict('Este e-mail já está em uso');
            }
        }

        const user = await userRepository.update(id, data);

        await activityLogService.log({
            userId,
            action: ActionType.USER_UPDATED,
            entity: "User",
            entityId: user.id,
            metadata: data,
        })

        return user;
    }

    async updateRole(id: number, role: roleEnum, userId?: number) {
        await this.getById(id);

        const user = await userRepository.update(id, { role });

        await activityLogService.log({
            userId,
            action: ActionType.USER_ROLE_CHANGED,
            entity: "User",
            entityId: user.id,
            metadata: { newRole: role }
        })

        return user;
    }

    async updateStatus(id: number, status: statusUserEnum, userId?: number) {
        await this.getById(id);

        const user = await userRepository.update(id, { status });

        await activityLogService.log({
            userId,
            action: ActionType.USER_STATUS_CHANGED,
            entity: "User",
            entityId: user.id,
            metadata: { newStatus: status },
        })

        return user;
    }

    async updatePassword(email: string, data: Pick<User, "password">, userId?: number) {
        await this.getByEmail(email);

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await userRepository.updatePassword(email, { password: hashedPassword });

        await activityLogService.log({
            userId,
            action: ActionType.USER_PASSWORD_CHANGED,
            entity: "User",
            entityId: user.id,
            metadata: { changedAt: new Date() }
        });

        return user
    }

    async delete(id: number, userId?: number) {
        await this.getById(id);

        const user = await userRepository.delete(id);

        await activityLogService.log({
            userId,
            action: ActionType.USER_DELETED,
            entity: "User",
            entityId: id
        })

        return user;
    }
}

export const userService = new UserService();