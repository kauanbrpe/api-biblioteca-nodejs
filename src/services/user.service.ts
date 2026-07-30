import { userRepository } from "../repositories/postgres/user.repository";
import { AppError } from "../utils/AppError";
import { parsePagination, buildPaginatedResult } from "../utils/paginate";
import { activityLogService } from "./activity.log.service";
import { ActionType } from "../models/activity.log.model";
import { User, roleEnum, statusUserEnum } from "../generated/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface RequestingUser {
    id: number;
    role: roleEnum;
}

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

    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw AppError.unauthorized('E-mail ou senha inválidos');
        }

        if (user.status === statusUserEnum.DISABLED) {
            throw AppError.forbidden('Esta conta está desativada');
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            throw AppError.unauthorized('E-mail ou senha inválidos')
        }

        const token = jwt.sign(
            {id: user.id, role: user.role},
            process.env.JWT_SECRET!,
            { expiresIn: '7d'},
        );

        const { password: _password, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
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

        const { password: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async update(id: number, data: Partial<Pick<User, "name" | "email">>, requestingUser: RequestingUser) {
        await this.getById(id);

        this.assertOwnerOrAdmin(id, requestingUser);

        if (data.email) {
            const existing = await userRepository.findByEmail(data.email);
            if(existing && existing.id !== id) {
                throw AppError.conflict('Este e-mail já está em uso');
            }
        }

        const user = await userRepository.update(id, data);

        await activityLogService.log({
            userId: requestingUser.id,
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

    async updatePassword(email: string, data: Pick<User, "password">, requestingUser: RequestingUser) {
        const targetUser = await this.getByEmail(email);

        this.assertOwnerOrAdmin(targetUser.id, requestingUser);

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await userRepository.updatePassword(email, { password: hashedPassword });

        await activityLogService.log({
            userId: requestingUser.id,
            action: ActionType.USER_PASSWORD_CHANGED,
            entity: "User",
            entityId: user.id,
            metadata: { changedAt: new Date() }
        });

        return user
    }

    async delete(id: number, requestingUser: RequestingUser) {
        await this.getById(id);

        this.assertOwnerOrAdmin(id, requestingUser);

        const user = await userRepository.delete(id);

        await activityLogService.log({
            userId: requestingUser.id,
            action: ActionType.USER_DELETED,
            entity: "User",
            entityId: id
        })

        return user;
    }

    private assertOwnerOrAdmin(targetId: number, requestingUser: RequestingUser) {
        const isOwner = requestingUser.id === targetId;
        const isAdmin = requestingUser.role === roleEnum.ADMIN;

        if (!isOwner && !isAdmin) {
            throw AppError.forbidden('Você não tem permissão para realizar esta ação');
        }
    }
}

export const userService = new UserService();