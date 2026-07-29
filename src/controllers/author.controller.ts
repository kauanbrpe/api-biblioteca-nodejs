import { Request, Response } from 'express';
import { authorService } from '../services/author.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/responseFormatter';
import { HttpStatus } from '../utils/httpStatus';

export class AuthorController {
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const result = await authorService.getAll(req.query);
        sendSuccess({ res, data: result });
    });

    getById = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const author = await authorService.getById(id);
        sendSuccess({ res, data: author });
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const author = await authorService.create(req.body, userId);
        sendSuccess({ res, statusCode: HttpStatus.CREATED, data: author});
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const userId = req.user!.id;
        const author = await authorService.update(id, req.body, userId);
        sendSuccess({ res, data: author });
    });

    delete = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const userId = req.user!.id;
        await authorService.delete(id, userId);
        sendSuccess({ res, statusCode: HttpStatus.NO_CONTENT });
    });
}

export const authorController = new AuthorController();