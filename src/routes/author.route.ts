import { Router } from "express";
import { authorController } from "../controllers/author.controller";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import { createAuthorSchema, updateAuthorSchema } from "../schemas/author.schema";

const authorRouter = Router();

// GET
authorRouter.get('/', authenticate, authorController.getAll);
authorRouter.get('/:id', authenticate, authorController.getById);

// POST
authorRouter.post('/', authenticate, authorize('ADMIN'), validate(createAuthorSchema), authorController.create);

// UPDATE
authorRouter.put('/:id', authenticate, authorize('ADMIN'), validate(updateAuthorSchema), authorController.update);

// DELETE
authorRouter.delete('/:id', authenticate, authorize('ADMIN'), authorController.delete);

export default authorRouter;