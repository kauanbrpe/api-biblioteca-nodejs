import mongoose, { Schema, model } from "mongoose";

export enum TypeEnum {
    LOAN_DUE = "LOAN_DUE",
    LOAN_OVERDUE = "LOAN_OVERDUE",
    RESERVATION_AVAILABLE = "RESERVATION_AVAILABLE"
}

export interface NotificationModel {
    _id: mongoose.Types.ObjectId,
    userId: number,
    type: TypeEnum,
    message: string,
    read: boolean,
    createdAt: Date
}

const notificationSchema = new Schema<NotificationModel>({
    userId: {
        type: Number,
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: Object.values(TypeEnum),
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const Notification = model<NotificationModel>("Notification", notificationSchema)