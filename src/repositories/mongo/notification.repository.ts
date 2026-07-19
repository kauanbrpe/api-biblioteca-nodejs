import { Notification, notificationModel } from "../../models/notification.model";

export class NotificationRepository {
    async findAll(): Promise<notificationModel[]> {
        return Notification.find().sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<notificationModel | null> {
        return Notification.findById(id);
    }

    async findByUserId(userId: number): Promise<notificationModel[]> {
        return Notification.find( { userId } ).sort( { createdAt: -1 } );
    }

    async create(data: Pick<notificationModel, "userId" | "type" | "message">): Promise<notificationModel> {
        return Notification.create(data);
    }

    async markAsRead(id: string): Promise<notificationModel | null> {
        return Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    }

    async delete(id: string): Promise<notificationModel | null> {
        return Notification.findByIdAndDelete(id);
    }

    async countByUserId(userId: number): Promise<number> {
        return Notification.countDocuments( { userId } );
    }
}

export const notificationRepository = new NotificationRepository();