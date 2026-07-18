import mongoose, { Schema, model } from "mongoose";

enum TypeEnum {
    LOAN_DUE = "LOAN_DUE",
    LOAN_OVERDUE = "LOAN_OVERDUE",
    RESERVATION_AVAILABLE = "RESERVATION_AVAILABLE"
}

interface notificationModel {
    _id: mongoose.Types.ObjectId,
    userId: number,
    type: TypeEnum,
    message: string,
    read: boolean,
    createdAt: Date
}

const notificationSchema = new Schema<notificationModel>({
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

export const notificationModel = model<notificationModel>("NotificationModel", notificationSchema)