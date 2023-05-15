import Article from "../models/article.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "./errorHandler.js";

export const getArticles = async (req, res, next) => {
  const { page = 1, limit = 10, title } = req.query;
  const query = title ? { title: { $regex: title, $options: "i" } } : {};
  const skip = (page - 1) * limit;
  try {
    const articles = await Article.find(query)
      .populate("owner", "fullName email age -_id")
      .skip(skip)
      .limit(Number(limit))
      .lean();
    if (!articles.length) {
      const err = errorHandler("No articles yet!", 404);
      throw err;
    }
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (req, res, next) => {
  const articleId = req.params.articleId;
  try {
    const article = await Article.findById(articleId).lean();
    if (!article) {
      const err = errorHandler("Article not found", 404);
      throw err;
    }
    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

export const createArticle = async (req, res, next) => {
  const { title, subtitle, description, owner, category } = req.body;
  try {
    const user = await User.findById(owner);
    if (!user) {
      const err = errorHandler("User not found", 404);
      throw err;
    }

    const article = new Article({
      title,
      subtitle,
      description,
      owner,
      category,
    });

    await article.save();

    user.numberOfArticles++;
    await user.save();
    res.status(201).json({ message: "Article created successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateArticleById = async (req, res, next) => {
  const { title, subtitle, description, category } = req.body;
  const articleId = req.params.articleId;
  const userId = req.user._id;
  try {
    const article = await Article.findById(articleId);
    if (!article) {
      const err = errorHandler("Article not found", 404);
      throw err;
    }
    const user = await User.findById(article.owner.toString());
    if (!user) {
      const err = errorHandler("User not found!", 404);
      throw err;
    }
    if (article.owner.toString() !== userId.toString()) {
      const err = errorHandler("Not authorized", 401);
      throw err;
    }
    article.title = title || article.title;
    article.subtitle = subtitle || article.subtitle;
    article.description = description || article.description;
    article.category = category || article.category;

    await article.save();
    res.status(200).json({ message: "Article updated successfully" });
  } catch (err) {
    next(err);
  }
};
export const likeArticleById = async (req, res, next) => {
  const articleId = req.params.articleId;
  const userId = req.user._id;
  try {
    const article = await Article.findById(articleId);
    if (!article) {
      const err = errorHandler("Article not found!", 404);
      throw err;
    }

    if (article.likes.includes(userId)) {
      const err = errorHandler("User has already liked the article", 400);
      throw err;
    }
    const user = await User.findById(userId);

    article.likes.push(userId);
    await article.save();

    user.likedArticles.push(articleId);
    await user.save();

    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};
export const unlikeArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const userId = req.user._id;

    const article = await Article.findById(articleId);
    if (!article) {
      const err = errorHandler("Article not found!", 404);
      throw err;
    }

    if (!article.likes.includes(userId)) {
      const err = errorHandler("User has not liked the article", 400);
      throw err;
    }
    const user = await User.findById(userId);
    
    article.likes.pull(userId);
    await article.save();

    user.likedArticles.pull(articleId);
    await user.save();

    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};
export const deleteArticleById = async (req, res, next) => {
  const articleId = req.params.articleId;
  const userId = req.user._id;
  try {
    const article = await Article.findById(articleId);
    if (!article) {
      const err = errorHandler("Article not found!", 404);
      throw err;
    }
    const user = await User.findById(article.owner);
    if (!user) {
      const err = errorHandler("User not found!", 404);
      throw err;
    }
    if (article.owner.toString() !== userId.toString()) {
      const err = errorHandler("Not authorized", 401);
      throw err;
    }

    user.numberOfArticles--;
    await user.save();

    await Article.findByIdAndDelete(articleId);

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    next(err);
  }
};
