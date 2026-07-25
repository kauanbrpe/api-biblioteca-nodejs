import mongoose, { Schema, model } from "mongoose";

export enum ActionType {
    BOOK_CREATED = "BOOK_CREATED",
    BOOK_UPDATED = "BOOK_UPDATED",
    BOOK_DELETED = "BOOK_DELETED",
    LOAN_CREATED = "LOAN_CREATED",
    LOAN_RETURNED = "LOAN_RETURNED",
    LOAN_OVERDUE = "LOAN_OVERDUE",
    LOAN_UPDATED = "LOAN_UPDATED",
    LOAN_DELETED = "LOAN_DELETED",
    USER_REGISTERED = "USER_REGISTERED",
    USER_UPDATED = "USER_UPDATED",
    USER_DELETED = "USER_DELETED",
    USER_PASSWORD_CHANGED = "USER_PASSWORD_CHANGE",
    USER_ROLE_CHANGED = "USER_ROLE_CHANGED",
    USER_STATUS_CHANGED = "USER_STATUS_CHANGED",
    AUTHOR_CREATED = "AUTHOR_CREATED",
    AUTHOR_UPDATED = "AUTHOR_UPDATED",
    AUTHOR_DELETED = "AUTHOR_DELETED",
}

export interface ActivityLogModel {
    _id: mongoose.Types.ObjectId,
    userId?: number,
    action: ActionType,
    entity: string,
    entityId: number,
    metadata: object,
    createdAt: Date
}

const activityLogSchema = new Schema<ActivityLogModel>({
    userId: {
        type: Number,
        required: false,
        index: true,
    },
    action: {
        type: String,
        enum: Object.values(ActionType),
        required: true,
    },
    entity: {
        type: String,
        required: true,
    },
    entityId: {
        type: Number,
        required: true,
    },
    metadata: {
        type: Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const ActivityLog = model<ActivityLogModel>("ActivityLog", activityLogSchema);