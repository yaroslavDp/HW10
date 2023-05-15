import User from '../models/user.model.js';
import Article from '../models/article.model.js';
import { errorHandler } from './errorHandler.js';
export const getUsers = async (req, res, next) => {
  const sort = req.query.sort || '';
  try {
    const users = await User.find({}, 'fullName email age')
      .sort(sort)
      .lean();
    
    if(!users.length){
      const err = errorHandler('No users yet!', 404);
      throw err
    }
    res.status(200).json(users);
  } catch (err) {

    next(err);
  }
}

export const getUserByIdWithArticles = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if(!user){
      const err = errorHandler('User not found', 404);
      throw err
    }
    const articles = await Article.find({ owner: user._id }, 'title subtitle createdAt -_id').lean();
    res.status(200).json({ user, articles });
  } catch (err) {
    next(err);
  }
}

export const createUser = async (req, res, next) => {
  const {firstName, lastName, email, role, age} = req.body;
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      role,
      age
    });
    await user.save();
    res.status(201).json({message: 'User created successfully'});
  } catch (err) {
    next(err);
  }
}

export const updateUserById = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if(!user){
      const err = errorHandler('User not found', 404);
      throw err
    } 
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.age = req.body.age || user.age;
    await user.save();
    res.status(200).json({message: 'User updated successfully'});
  } catch (err) {
    next(err);
  }
}

export const deleteUserById = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const err = errorHandler('User not found', 404);
      throw err
    }
    await Article.deleteMany({ owner: user._id });
    await User.findByIdAndDelete(userId);
    res.status(200).json({message: 'User deleted successfully'});
  } catch (err) {
    next(err);
  }
}

