import mongoose, { Schema, model } from "mongoose";

interface reviewModel {
    _id: mongoose.Types.ObjectId,
    bookId: number,
    userId: number,
    rating: number,
    comment?: string,
    createdAt: Date
}

const reviewSchema = new Schema<reviewModel>({
    bookId: {
        type: Number,
        required: true,
        index: true,
    },
    userId: {
        type: Number,
        required: true,
        index: true,
    },
    rating: {
        type: Number,
        required: true,
        min: [1, "A nota mínima é 1"],
        max: [5, "A nota máxima é 5"],
        validate: {
            validator: Number.isInteger,
            message: "A nota deve ser um número inteiro"
        }
    },
    comment: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const ReviewModel = model<reviewModel>("ReviewModel", reviewSchema)