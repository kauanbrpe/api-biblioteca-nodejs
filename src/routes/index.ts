import { Router } from 'express';
import userRouter from './user.route';
import authorRouter from './author.route';
import bookRouter from './book.route';
import notificationRouter from './notification.route';
import reviewRoute from './review.route';
import loanRouter from './loan.route';

const router = Router();

router.use('/users', userRouter);
router.use('/authors', authorRouter);
router.use('/books', bookRouter);
router.use('/notifications', notificationRouter);
router.use('/reviews', reviewRoute);
router.use('/loans', loanRouter);

export default router;