import { bookRepository } from "../repositories/postgres/book.repository";
import { AppError } from "../utils/AppError";
import { parsePagination, buildPaginatedResult } from "../utils/paginate";
import { activityLogService } from "./activity.log.service";
import { ActionType } from "../models/activity.log.model";
import { Book } from "@prisma/client";
import { authorRepository } from "../repositories/postgres/author.repository";

export class BookService {
    async getAll(query: { page?: string; limit?: string }) {
        const { page, limit, skip } = parsePagination(query);

        const books = await bookRepository.findAll( { skip, take: limit });
        const totalItems = await bookRepository.count();

        return buildPaginatedResult(books, { page, limit, totalItems });
    }

    async getById(id: number) {
        const book = await bookRepository.findById(id);

        if (!book) {
            throw AppError.notFound('Livro não encontrado');
        }

        return book;
    }

    async getByIsbn(isbn: string) {
        const book = await bookRepository.findByIsbn(isbn);

        if (!book) {
            throw AppError.notFound('Livro não encontrado');
        }

        return book;
    }

    async getByAuthor(authorId: number) {
        const authorExists = await authorRepository.findById(authorId);

        if (!authorExists) {
            throw AppError.notFound('Autor não encontrado');
        }

        return bookRepository.findByAuthorId(authorId);
    }

    async create(data: Pick<Book, "title" | "isbn" | "publishedYear" | "totalCopies" | "avaiableCopies" | "authorId">, userId?: number) {
        const existingIsbn = await bookRepository.findByIsbn(data.isbn);
        if (existingIsbn) {
            throw AppError.conflict('Este ISBN já está sendo utilizado');
        }

        await this.getByAuthor(data.authorId);

        const book = await bookRepository.create(data);

        await activityLogService.log({
            userId,
            action: ActionType.BOOK_CREATED,
            entity: "Book",
            entityId: book.id,
        });

        return book;
    }

    async update(id: number, data: Partial<Pick<Book, "title" | "isbn" | "publishedYear" | "totalCopies" | "avaiableCopies" | "authorId">>, userId?: number,) {
        await this.getById(id);

        if (data.isbn) {
            const existingIsbn = await bookRepository.findByIsbn(data.isbn);
            if (existingIsbn && existingIsbn.id !== id) {
                throw AppError.conflict('Este ISBN já está sendo utilizado por outro livro');
            }
        }

        if (data.authorId) {
            await this.getByAuthor(data.authorId);
        }

        const book = await bookRepository.update(id, data);

        await activityLogService.log({
            userId,
            action: ActionType.BOOK_UPDATED,
            entity: "Book",
            entityId: book.id,
            metadata: data,
        });

        return book;
    }

    async delete(id: number, userId?: number) {
        await this.getById(id);

        const book = await bookRepository.delete(id);

        await activityLogService.log({
            userId,
            action: ActionType.BOOK_DELETED,
            entity: "Book",
            entityId: id
        })

        return book;
    }
}

export const bookService = new BookService();