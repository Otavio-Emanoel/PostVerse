import { Router } from 'express';
import { getMe, getUserPosts } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.get('/:id/posts', getUserPosts);

export default router;
