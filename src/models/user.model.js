import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 60
    },
    fullName: {
        type: String
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email",
      }
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'writer', 'guest'],
        message: 'Role is either: admin, writer or guest.'
      }
    },
    age: {
      type: Number,
      min: 1,
      max: 99
    },
    numberOfArticles: {
      type: Number,
      default: 0
    },
    likedArticles: [
      { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Article' 
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
  }
);
userSchema.pre("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
