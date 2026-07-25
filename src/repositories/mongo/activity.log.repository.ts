import { ActivityLog, ActivityLogModel } from "../../models/activity.log.model";

export class ActivityLogRepository {
    async findAll(params?: { skip?: number; limit?: number }): Promise<ActivityLogModel[]> {
        return ActivityLog.find()
            .sort({ createdAt: -1 })
            .skip(params?.skip ?? 0)
            .limit(params?.limit ?? 0);
    }

    async count(): Promise<number> {
        return ActivityLog.countDocuments();
    }

    async findById(id: string): Promise<ActivityLogModel | null> {
        return ActivityLog.findById(id);
    }

    async findByUserId(userId: number): Promise<ActivityLogModel[]> {
        return ActivityLog.find( { userId } ).sort( { createdAt: -1 } );
    }

    async findByEntity(entity: string, entityId: number): Promise<ActivityLogModel[]> {
        return ActivityLog.find( { entity, entityId } ).sort( { createdAt: -1 } );
    }

    async create(data: Pick<ActivityLogModel, "action" | "entity" | "entityId"> & Partial<Pick<ActivityLogModel, "userId" | "metadata">>): Promise<ActivityLogModel> {
        return ActivityLog.create(data);
    }

    async countByUserId(userId: number): Promise<number> {
        return ActivityLog.countDocuments( { userId });
    }
}

export const activityLogRepository = new ActivityLogRepository();
