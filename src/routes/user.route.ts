import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
    loginSchema, createUserSchema, updateUserSchema,
    updateRoleSchema, updateStatusSchema, updatePasswordSchema,
} from '../schemas/user.schema';

const userRouter = Router();

// GET
userRouter.get('/', authenticate, authorize('ADMIN'), userController.getAll);
userRouter.get('/email/:email', authenticate, authorize('ADMIN'), userController.getByEmail);
userRouter.get('/:id', authenticate, authorize('ADMIN'), userController.getById);

// POST
userRouter.post('/login', validate(loginSchema), userController.login);
userRouter.post('/', validate(createUserSchema), userController.create);

// UPDATE
userRouter.put('/:id', authenticate, validate(updateUserSchema), userController.update);
userRouter.patch('/:id/role', authenticate, authorize('ADMIN'), validate(updateRoleSchema), userController.updateRole);
userRouter.patch('/:id/status', authenticate, authorize('ADMIN'), validate(updateStatusSchema), userController.updateStatus);
userRouter.patch('/password', authenticate, validate(updatePasswordSchema), userController.updatePassword);

// DELETE
userRouter.delete('/:id', authenticate, authorize('ADMIN'), userController.delete);

export default userRouter;