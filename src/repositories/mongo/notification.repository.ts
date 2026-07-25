import { Notification, NotificationModel } from "../../models/notification.model";

export class NotificationRepository {
    async findAll(params?: { skip?: number; limit?: number }): Promise<NotificationModel[]> {
        return Notification.find()
            .sort({ createdAt: -1 })
            .skip(params?.skip ?? 0)
            .limit(params?.limit ?? 0);
    }

    async count(): Promise<number> {
        return Notification.countDocuments();
    }

    async findById(id: string): Promise<NotificationModel | null> {
        return Notification.findById(id);
    }

    async findByUserId(userId: number): Promise<NotificationModel[]> {
        return Notification.find( { userId } ).sort( { createdAt: -1 } );
    }

    async create(data: Pick<NotificationModel, "userId" | "type" | "message">): Promise<NotificationModel> {
        return Notification.create(data);
    }

    async markAsRead(id: string): Promise<NotificationModel | null> {
        return Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    }

    async delete(id: string): Promise<NotificationModel | null> {
        return Notification.findByIdAndDelete(id);
    }

    async countByUserId(userId: number): Promise<number> {
        return Notification.countDocuments( { userId } );
    }
}

export const notificationRepository = new NotificationRepository();
