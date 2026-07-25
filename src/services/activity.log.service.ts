import { activityLogRepository } from "../repositories/mongo/activity.log.repository";
import { ActivityLogModel, ActionType } from "../models/activity.log.model";
import { parsePagination, buildPaginatedResult } from "../utils/paginate";

export class ActivityLogService {
    async log(data: {
        userId?: number;
        action: ActionType;
        entity: string;
        entityId: number;
        metadata?: object;
    }): Promise<ActivityLogModel> {
        return activityLogRepository.create(data);
    }

    async getAll(query: { page?: string; limit?: string }) {
        const { page, limit, skip } = parsePagination(query);

        const logs = await activityLogRepository.findAll({ skip, limit });
        const totalItems = await activityLogRepository.count();

        return buildPaginatedResult(logs, { page, limit, totalItems });
    }

    async getByUserId(userId: number): Promise<ActivityLogModel[]> {
        return activityLogRepository.findByUserId(userId);
    }

    async getByEntity(entity: string, entityId: number): Promise<ActivityLogModel[]> {
        return activityLogRepository.findByEntity(entity, entityId);
    }
}

export const activityLogService = new ActivityLogService();