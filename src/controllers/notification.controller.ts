import { Request, Response } from "express";
import { notificationService } from "../services/notification.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/responseFormatter";
import { HttpStatus } from "../utils/httpStatus";

export class NotificationController {
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const result = await notificationService.getAll(req.query);
        sendSuccess({ res, data: result })
    })

    getById = asyncHandler(async (req: Request, res: Response) => {
        const id = String(req.params.id);
        const notification = await notificationService.getById(id);
        sendSuccess({ res, data: notification });
    })

    getByUserId = asyncHandler(async (req: Request, res: Response) => {
        const userId = Number(req.params.userId);
        const notifications = await notificationService.getByUserId(userId);
        sendSuccess({ res, data: notifications });
    })

    create = asyncHandler(async (req: Request, res: Response) => {
        const notification = await notificationService.create(req.body);
        sendSuccess({ res, statusCode: HttpStatus.CREATED, data: notification})
    });

    markAsRead = asyncHandler(async (req: Request, res: Response) => {
        const requestingUserId = req.user!.id;
        const notificationId = String(req.params.id);

        const notificationRead = await notificationService.markAsRead(notificationId, requestingUserId);
        sendSuccess({ res, message: 'Notificação marcada como lida com sucesso', data: notificationRead});
    })

    delete = asyncHandler(async (req: Request, res: Response) => {
        const id = String(req.params.id);
        await notificationService.delete(id);
        sendSuccess({ res, statusCode: HttpStatus.NO_CONTENT});
    })
}

export const notificationController = new NotificationController();