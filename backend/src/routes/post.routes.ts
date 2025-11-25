import { Router } from 'express';
import { getPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/post.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
