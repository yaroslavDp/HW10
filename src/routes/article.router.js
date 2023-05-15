import { Router } from 'express';
import {
  createArticle,
  updateArticleById,
  deleteArticleById,
  getArticles,
  getArticleById,
  likeArticleById,
  unlikeArticleById,
} from '../controllers/article.controller.js';

import { protect } from '../middlewares/authMiddleware.js';

const articleRouter = Router();

articleRouter
  .get('/', getArticles)
  .get('/:articleId', protect, getArticleById)
  .post('/', createArticle)
  .post('/:articleId/like', protect, likeArticleById)
  .post('/:articleId/unlike', protect, unlikeArticleById)
  .put('/:articleId', protect, updateArticleById)
  .delete('/:articleId', protect, deleteArticleById);

export default articleRouter;
