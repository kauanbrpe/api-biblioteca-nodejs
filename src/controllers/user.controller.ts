import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/responseFormatter";
import { HttpStatus } from "../utils/httpStatus";

export class UserController {
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const result = await userService.getAll(req.query);
        sendSuccess({ res, data: result });
    })

    getById = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const user = await userService.getById(id);
        sendSuccess({ res, data: user });
    })

    getByEmail = asyncHandler(async (req: Request, res: Response) => {
        const email = String(req.params.email);
        const user = await userService.getByEmail(email);
        sendSuccess({ res, data: user });
    })

    login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const result = await userService.login(email, password);
        sendSuccess({ res, message: 'Login realizado com sucesso', data: result });
    })

    create = asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.create(req.body);
        sendSuccess({ res, statusCode: HttpStatus.CREATED, data: user });
    })

    update = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const requestingUser = req.user!; // { id, role }, já vem do authenticate
        const user = await userService.update(id, req.body, requestingUser);
        sendSuccess({ res, data: user });
    })

    updateRole = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const requestingUserId = req.user!.id;
        const { role } = req.body;
        const user = await userService.updateRole(id, role, requestingUserId);
        sendSuccess({ res, data: user });
    })

    updateStatus = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const requestingUserId = req.user!.id;
        const { status } = req.body;
        const user = await userService.updateStatus(id, status, requestingUserId);
        sendSuccess({ res, data: user });
    })

    updatePassword = asyncHandler(async (req: Request, res: Response) => {
        const requestingUser = req.user!;
        const { email, password } = req.body;
        const user = await userService.updatePassword(email, { password }, requestingUser);
        sendSuccess({ res, message: 'Senha atualizada com sucesso', data: user });
    })

    delete = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const requestingUser = req.user!;
        await userService.delete(id, requestingUser);
        sendSuccess({ res, statusCode: HttpStatus.NO_CONTENT });
    })
}

export const userController = new UserController();