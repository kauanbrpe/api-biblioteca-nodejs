import { Router } from "express";
import { bookController } from "../controllers/book.controller";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import { createBookSchema, updateBookSchema } from "../schemas/book.schema";

const bookRouter = Router();

// GET
bookRouter.get('/', authenticate, bookController.getAll);
bookRouter.get('/:id', authenticate, bookController.getById);
bookRouter.get('/isbn/:isbn', authenticate, bookController.getByIsbn);
bookRouter.get('/author/:authorId', authenticate, bookController.getByAuthor);

// POST
bookRouter.post('/', authenticate, authorize('ADMIN'), validate(createBookSchema), bookController.create);

// UPDATE
bookRouter.put('/:id', authenticate, authorize('ADMIN'), validate(updateBookSchema), bookController.update);

// DELETE
bookRouter.delete('/:id', authenticate, authorize('ADMIN'), bookController.delete);

export default bookRouter;