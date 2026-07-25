import { notificationRepository } from "../repositories/mongo/notification.repository";
import { NotificationModel } from "../models/notification.model";
import { AppError } from "../utils/AppError";
import { parsePagination, buildPaginatedResult } from "../utils/paginate";
import { userRepository } from "../repositories/postgres/user.repository";

export class NotificationService {
    async getAll(query: { page?: string; limit?: string}) {
        const { page, limit, skip } = parsePagination(query);

        const notifications = await notificationRepository.findAll( { skip, limit } );
        const totalItems = await notificationRepository.count();

        return buildPaginatedResult(notifications, { page, limit, totalItems });
    }

    async getById(id: string) {
        const notification = await notificationRepository.findById(id);

        if (!notification) {
            throw AppError.notFound('Notificação não encontrada');
        }

        return notification;
    }

    async getByUserId(userId: number) {
        const userExists = await userRepository.findById(userId);

        if (!userExists) {
            throw AppError.notFound('Usuário não encontrado');
        }

        return notificationRepository.findByUserId(userId);
    }

    async create(data: Pick<NotificationModel, "userId" | "type" | "message">) {
        await this.getByUserId(data.userId);

        const notification = await notificationRepository.create(data);

        return notification;
    }

    async markAsRead(id: string) {
        await this.getById(id);

        const notification = await notificationRepository.markAsRead(id);

        return notification;
    }

    async delete(id: string) {
        await this.getById(id);

        const notification = await notificationRepository.delete(id);

        return notification;
    }
}

export const notificationService = new NotificationService();