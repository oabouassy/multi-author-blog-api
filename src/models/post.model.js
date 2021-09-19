const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "A post MUST have a title !"],
    trim: true,
  },
  slug: {
    type: String,
  },
  body: {
    type: String,
    required: [true, "A post MUST have a body !"],
  },
  coverImage: {
    type: String,
  },
  blogImages: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  modifiedAt: {
    type: Date,
  },
  category: {
    type: [String],
    enum: {
      values: [
        "sports",
        "technology",
        "books",
        "courses",
        "tutorials",
        "others",
      ],
      message:
        "A post's Category must be one of: [sports,technology,books,courses,tutorials,others,] only",
    },
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "A post MUST be written by a certain user !"],
  },
});

postSchema.pre("save", function (next) {
  if (!this.isNew || !this.isModified("title")) return next();
  this.slug = slugify(this.title, {
    lower: true,
    trim: true,
  });
  next();
});

postSchema.pre(/^find/, function (next) {
  this.select("-__v").populate({
    path: "user",
    // select: "fname lname email role",
  });
  next();
});
module.exports = mongoose.model("Post", postSchema);
