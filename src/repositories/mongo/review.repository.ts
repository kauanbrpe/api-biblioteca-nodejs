import { Review, reviewModel } from "../../models/review.model";

export class ReviewRepository {
    async findAll(): Promise<reviewModel[]> {
        return Review.find().sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<reviewModel | null> {
        return Review.findById(id);
    }

    async findByBookId(bookId: number): Promise<reviewModel[]> {
        return Review.find( { bookId } ).sort( { createdAt: -1 } );
    }

    async findByUserId(userId: number): Promise<reviewModel[]> {
        return Review.find( { userId } ).sort( { createdAt: -1 } );
    }

    async create(data: Pick<reviewModel, "bookId" | "userId" | "rating" | "comment">): Promise<reviewModel> {
        return Review.create(data);
    }

    async update(id: string, data: { rating: number, comment: string}): Promise<reviewModel | null> {
        return Review.findByIdAndUpdate(id, { data }, { new: true });
    }

    async delete(id: string): Promise<reviewModel | null> {
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