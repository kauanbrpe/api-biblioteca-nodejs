import mongoose, { Schema, model } from "mongoose";

enum ActionType {
    BOOK_CREATED = "BOOK_CREATED",
    LOAN_CREATED = "LOAN_CREATED",
    LOAN_RETURNED = "LOAN_RETURNED",
    USER_REGISTERED = "USER_REGISTERED"
}

interface activityLogModel {
    _id: mongoose.Types.ObjectId,
    userId?: number,
    action: ActionType,
    entity: string,
    entityId: number,
    metadata: object,
    createdAt: Date
}

const activityLogSchema = new Schema<activityLogModel>({
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

export const ActivityLogModel = model<activityLogModel>("ActivityLogModel", activityLogSchema);