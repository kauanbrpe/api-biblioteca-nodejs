import { reviewRepository } from "../repositories/mongo/review.repository";
import { ReviewModel } from "../models/review.model";
import { AppError } from "../utils/AppError";
import { parsePagination, buildPaginatedResult } from "../utils/paginate";
import { userRepository } from "../repositories/postgres/user.repository";
import { bookRepository } from "../repositories/postgres/book.repository";

export class ReviewService {
    async getAll(query: { page?: string; limit?: string}) {
        const { page, limit, skip } = parsePagination(query);

        const reviews = await reviewRepository.findAll( { skip, limit } );
        const totalItems = await reviewRepository.count();

        return buildPaginatedResult(reviews, { page, limit, totalItems });
    }

    async getById(id: string) {
        const review = await reviewRepository.findById(id);

        if (!review) {
            throw AppError.notFound('Review não encontrada');
        }

        return review;
    }

    async getByUserId(userId: number) {
        const userExists = await userRepository.findById(userId);

        if (!userExists) {
            throw AppError.notFound('Usuário não encontrado');
        }

        return reviewRepository.findByUserId(userId);
    }

    async getByBookId(bookId: number) {
        const bookExists = await bookRepository.findById(bookId);

        if (!bookExists) {
            throw AppError.notFound('Livro não encontrado');
        }

        return reviewRepository.findByBookId(bookId);
    }

    async create(data: Pick<ReviewModel, "bookId" | "userId" | "rating"> & Partial<Pick<ReviewModel, "comment">>) {
        await this.getByUserId(data.userId);

        await this.getByBookId(data.bookId);

        const review = await reviewRepository.create(data);

        return review;
    }

    async update(id: string, data: { rating: number; comment: string}) {
        await this.getById(id);

        const review = await reviewRepository.update(id, data);

        return review;
    }

    async delete(id: string) {
        await this.getById(id);

        const review = await reviewRepository.delete(id);

        return review;
    }
}

export const reviewService = new ReviewService();