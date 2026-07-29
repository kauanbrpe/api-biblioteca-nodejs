import { Router } from "express";
import { loanController } from "../controllers/loan.controller";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import { createLoanSchema, updateLoanSchema, correctReturnDateSchema } from "../schemas/loan.schema";

const loanRouter = Router();

// GET
loanRouter.get('/', authenticate, authorize('ADMIN'), loanController.getAll);
loanRouter.get('/:id', authenticate, authorize('ADMIN'), loanController.getById);
loanRouter.get('/user/:userId', authenticate, authorize('ADMIN'), loanController.getByUser);
loanRouter.get('/book/:bookId', authenticate, authorize('ADMIN'), loanController.getByBook);

// POST
loanRouter.post('/', authenticate, validate(createLoanSchema), loanController.create);
loanRouter.post('/:id/return', authenticate, loanController.returnLoanUpdate);
loanRouter.post('/:id/check-overdue', authenticate, loanController.checkExpired);

// UPDATE
loanRouter.put('/:id', authenticate, validate(updateLoanSchema), loanController.update);
loanRouter.patch(
    '/:id/return-date',
    authenticate,
    authorize('ADMIN'),
    validate(correctReturnDateSchema),
    loanController.correctReturnDate,
);

// DELETE
loanRouter.delete('/:id', authenticate, authorize('ADMIN'), loanController.delete);

export default loanRouter;