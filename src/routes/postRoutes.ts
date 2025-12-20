import { Router } from 'express';
import { uploadMiddleware } from '../middleware/upload';
import {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  addComment,
  getComments,
} from '../controllers/postController';

const router = Router();

router.post('/', uploadMiddleware.array('images', 10), createPost);
router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);
router.put('/', uploadMiddleware.single('file'), updatePost);
router.delete('/:id', deletePost);

router.post('/:slug/comment', addComment);
router.get('/:slug/comments', getComments);

export default router;