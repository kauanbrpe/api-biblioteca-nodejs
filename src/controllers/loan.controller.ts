import { Request, Response } from "express";
import { loanService } from "../services/loan.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/responseFormatter";
import { HttpStatus } from "../utils/httpStatus";

export class LoanController {
    getAll = asyncHandler(async(req: Request, res: Response) => {
        const result = await loanService.getAll(req.query);
        sendSuccess({ res, data: result })
    });

    getById = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const loan = await loanService.getById(id);
        sendSuccess({ res, data: loan });
    });

    getByUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = Number(req.params.userId);
        const loans = await loanService.getByUserId(userId);
        sendSuccess( { res, data: loans });
    });

    getByBook = asyncHandler(async (req: Request, res: Response) => {
        const bookId = Number(req.params.bookId);
        const loans = await loanService.getByBookId(bookId);
        sendSuccess( { res, data: loans });
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const loan = await loanService.create(req.body, userId);
        sendSuccess({ res, statusCode: HttpStatus.CREATED, data: loan});
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const userId = req.user!.id;

        const loan = await loanService.updateLoan(id, req.body, userId);
        sendSuccess({ res, data: loan });
    });

    returnLoanUpdate = asyncHandler(async (req: Request, res: Response) => {
        const loanId = Number(req.params.id);
        const userId = req.user!.id;

        const loan = await loanService.returnLoanUpdate(loanId, userId);
        sendSuccess({ res, message: 'Livro retornado com sucesso', data: loan })
    });

    correctReturnDate = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const userId = req.user!.id;
        const { returnDate } = req.body;

        const loan = await loanService.correctReturnDate(id, returnDate, userId);
        sendSuccess({ res, message: 'Data de retorno corrigida', data: loan})
    });

    checkExpired = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const loan = await loanService.overdueLoan(id);
        sendSuccess({ res, data: loan });
    });

    delete = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const userId = req.user!.id;
        await loanService.delete(id, userId);
        sendSuccess({ res, statusCode: HttpStatus.NO_CONTENT });
    });
}

export const loanController = new LoanController();