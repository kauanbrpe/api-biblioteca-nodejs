import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import { createReviewSchema, updateReviewSchema } from "../schemas/review.schema";

const reviewRoute = Router();

// GET
reviewRoute.get('/', authenticate, authorize('ADMIN'), reviewController.getAll);
reviewRoute.get('/:id', authenticate, reviewController.getById);
reviewRoute.get('/user/:userId', authenticate, authorize('ADMIN'), reviewController.getByUserId);
reviewRoute.get('/book/:bookId', authenticate, reviewController.getByBookId);

// POST
reviewRoute.post('/', authenticate, validate(createReviewSchema), reviewController.create);

// UPDATE
reviewRoute.put('/:id', authenticate, validate(updateReviewSchema), reviewController.update);

// DELETE
reviewRoute.delete('/:id', authenticate, reviewController.delete);

export default reviewRoute;