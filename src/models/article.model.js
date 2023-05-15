import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 400,
        trim: true,
      },
      subtitle: {
        type: String,
        minlength: 5,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 5000,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      category: {
        type: String,
        enum: {
          values: ['sport', 'games', 'history'],
          message: 'Category is either: sport, games or history.'
        },
        required: true,
      },
      likes: [
        { 
          type: mongoose.Schema.Types.ObjectId, ref: 'User' 
        }
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }
});

articleSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Article = mongoose.model('Article', articleSchema);

export default Article;