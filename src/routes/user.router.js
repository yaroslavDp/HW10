import { Router } from 'express';
import {
  createUser,
  getUsers,
  updateUserById,
  deleteUserById,
  getUserByIdWithArticles,
} from '../controllers/user.controller.js';
import {ageValid}  from '../middlewares/ageMiddleware.js';
const userRouter = Router();

userRouter
  .get('/', getUsers)
  .get('/:userId', getUserByIdWithArticles)
  .post('/', ageValid, createUser)
  .put('/:userId', ageValid, updateUserById)
  .delete('/:userId', deleteUserById);

export default userRouter;
