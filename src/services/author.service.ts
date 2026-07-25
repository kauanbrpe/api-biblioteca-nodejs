import { authorRepository } from "../repositories/postgres/author.repository";
import { AppError } from "../utils/AppError";
import { parsePagination, buildPaginatedResult } from "../utils/paginate";
import { activityLogService } from "./activity.log.service";
import { ActionType } from "../models/activity.log.model";
import { Author } from "../generated/prisma";

export class AuthorService {
    async getAll(query: { page?: string; limit?: string }) {
        const { page, limit, skip } = parsePagination(query);

        const authors = await authorRepository.findAll({ skip, take: limit });
        const totalItems = await authorRepository.count();

        return buildPaginatedResult(authors, { page, limit, totalItems });
    }

    async getById(id: number) {
        const author = await authorRepository.findById(id);

        if (!author) {
            throw AppError.notFound('Autor não encontrado');
        }

        return author;
    }

    async create(
        data: Pick<Author, "name"> & Partial<Pick<Author, "bio" | "birthDate" | "nationality">>,
        userId?: number,
    ) {
        const author = await authorRepository.create(data);

        await activityLogService.log({
            userId,
            action: ActionType.AUTHOR_CREATED,
            entity: "Author",
            entityId: author.id,
        });

        return author;
    }

    async update(
        id: number,
        data: Partial<Pick<Author, "name" | "bio" | "birthDate" | "nationality">>,
        userId?: number,
    ) {
        await this.getById(id);

        const author = await authorRepository.update(id, data);

        await activityLogService.log({
            userId,
            action: ActionType.AUTHOR_UPDATED,
            entity: "Author",
            entityId: author.id,
            metadata: data,
        });

        return author;
    }

    async delete(id: number, userId?: number) {
        await this.getById(id);

        const author = await authorRepository.delete(id);

        await activityLogService.log({
            userId,
            action: ActionType.AUTHOR_DELETED,
            entity: "Author",
            entityId: id,
        });

        return author;
    }
}

export const authorService = new AuthorService();