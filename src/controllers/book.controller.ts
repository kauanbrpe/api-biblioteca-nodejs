import { Request, Response } from "express";
import { bookService } from "../services/book.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/responseFormatter";
import { HttpStatus } from "../utils/httpStatus";

export class BookController {
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const result = await bookService.getAll(req.query);
        sendSuccess({ res, data: result });
    });

    getById = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const book = await bookService.getById(id);
        sendSuccess({ res, data: book });
    });

    getByIsbn = asyncHandler(async (req: Request, res: Response) => {
        const isbn = String(req.params.isbn);
        const book = await bookService.getByIsbn(isbn);
        sendSuccess({ res, data: book });
    });

    getByAuthor = asyncHandler(async (req: Request, res: Response) => {
        const authorId = Number(req.params.authorId);
        const books = await bookService.getByAuthor(authorId);
        sendSuccess( { res, data: books });
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const book = await bookService.create(req.body, userId);
        sendSuccess({ res, statusCode: HttpStatus.CREATED, data: book});
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const userId = req.user!.id;
        const book = await bookService.update(id, req.body, userId);
        sendSuccess({ res, data: book });
    });

    delete = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const userId = req.user!.id;
        await bookService.delete(id, userId);
        sendSuccess({ res, statusCode: HttpStatus.NO_CONTENT });
    });
}

export const bookController = new BookController();