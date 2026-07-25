import { Review, ReviewModel } from "../../models/review.model";

export class ReviewRepository {
    async findAll(params?: { skip?: number; limit?: number }): Promise<ReviewModel[]> {
        return Review.find()
            .sort({ createdAt: -1 })
            .skip(params?.skip ?? 0)
            .limit(params?.limit ?? 0);
    }

    async count(): Promise<number> {
        return Review.countDocuments();
    }

    async findById(id: string): Promise<ReviewModel | null> {
        return Review.findById(id);
    }

    async findByBookId(bookId: number): Promise<ReviewModel[]> {
        return Review.find( { bookId } ).sort( { createdAt: -1 } );
    }

    async findByUserId(userId: number): Promise<ReviewModel[]> {
        return Review.find( { userId } ).sort( { createdAt: -1 } );
    }

    async create(data: Pick<ReviewModel, "bookId" | "userId" | "rating"> & Partial<Pick<ReviewModel, "comment">>): Promise<ReviewModel> {
        return Review.create(data);
    }

    async update(id: string, data: { rating: number; comment: string }): Promise<ReviewModel | null> {
        return Review.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<ReviewModel | null> {
        return Review.findByIdAndDelete(id);
    }

    async countByBookId(bookId: number): Promise<number> {
        return Review.countDocuments( { bookId } );
    }

    async countByUserId(userId: number): Promise<number> {
        return Review.countDocuments( { userId } );
    }
}

export const reviewRepository = new ReviewRepository();
