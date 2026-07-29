import { reviewRepository } from "../repositories/mongo/review.repository";
import { ReviewModel } from "../models/review.model";
import { AppError } from "../utils/AppError";
import { parsePagination, buildPaginatedResult } from "../utils/paginate";
import { userRepository } from "../repositories/postgres/user.repository";
import { bookRepository } from "../repositories/postgres/book.repository";
import { roleEnum } from "../generated/prisma";

interface RequestingUser {
    id: number;
    role: roleEnum;
}

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

    async update(id: string, data: { rating: number; comment: string }, requestingUserId: number) {
        const review = await this.getById(id);

        if (review.userId !== requestingUserId) {
            throw AppError.forbidden('Você não tem permissão para editar esta avaliação');
        }

        const updated = await reviewRepository.update(id, data);

        return updated;
    }

    async delete(id: string, requestingUser: RequestingUser) {
        const review = await this.getById(id);

        const isOwner = review.userId === requestingUser.id;
        const isAdmin = requestingUser.role === roleEnum.ADMIN;

        if (!isOwner && !isAdmin) {
            throw AppError.forbidden('Você não tem permissão para excluir esta avaliação');
        }

        const deleted = await reviewRepository.delete(id);

        return deleted;
    }
}

export const reviewService = new ReviewService();