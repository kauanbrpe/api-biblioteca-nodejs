import { Request, Response } from "express";
import { reviewService } from "../services/review.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/responseFormatter";
import { HttpStatus } from "../utils/httpStatus";

export class ReviewController {
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const result = await reviewService.getAll(req.query);
        sendSuccess({ res, data: result })
    })

    getById = asyncHandler(async (req: Request, res: Response) => {
        const id = String(req.params.id);
        const review = await reviewService.getById(id);
        sendSuccess({ res, data: review });
    })

    getByUserId = asyncHandler(async (req: Request, res: Response) => {
        const userId = Number(req.params.userId);
        const reviews = await reviewService.getByUserId(userId);
        sendSuccess({ res, data: reviews });
    })

    getByBookId = asyncHandler(async (req: Request, res: Response) => {
        const bookId = Number(req.params.bookId);
        const reviews = await reviewService.getByBookId(bookId);
        sendSuccess({ res, data: reviews });
    })

    create = asyncHandler(async (req: Request, res: Response) => {
        // userId sempre vem do token, nunca do body, para impedir
        // que alguém crie uma review em nome de outro usuário.
        const userId = req.user!.id;
        const review = await reviewService.create({ ...req.body, userId });
        sendSuccess({ res, statusCode: HttpStatus.CREATED, data: review});
    })

    update = asyncHandler(async (req: Request, res: Response) => {
        const id = String(req.params.id);
        const userId = req.user!.id;
        const review = await reviewService.update(id, req.body, userId);
        sendSuccess({ res, data: review });
    })

    delete = asyncHandler(async (req: Request, res: Response) => {
        const id = String(req.params.id);
        const requestingUser = req.user!;
        await reviewService.delete(id, requestingUser);
        sendSuccess({ res, statusCode: HttpStatus.NO_CONTENT});
    })
}

export const reviewController = new ReviewController();