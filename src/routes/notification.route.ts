import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createNotificationSchema } from '../schemas/notification.schema';

const notificationRouter = Router();

// GET
notificationRouter.get('/', authenticate, authorize('ADMIN'), notificationController.getAll);
notificationRouter.get('/:id', authenticate, authorize('ADMIN'), notificationController.getById);
notificationRouter.get('/user/:userId', authenticate, authorize('ADMIN'), notificationController.getByUserId);

// POST
notificationRouter.post('/', authenticate, authorize('ADMIN'), validate(createNotificationSchema), notificationController.create);

// UPDATE
notificationRouter.put('/:id', authenticate, notificationController.markAsRead);

// DELETE
notificationRouter.delete('/:id', authenticate, authorize('ADMIN'), notificationController.delete);

export default notificationRouter;
