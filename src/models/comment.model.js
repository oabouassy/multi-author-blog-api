const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  body: {
    type: String,
    required: [true, "A comment can NOT be empty !"],
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
    required: [true, "Please specify WHICH POST you want to comment on !"],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please let me know your identity !"],
  },
  createdAt: {
    type: String,
    default: Date.now(),
  },
  modifiedAt: String,
});

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "post",
    // select: "title",
  }).populate({
    path: "user",
    // select: "profile fname lname",
  });
  next();
});
commentSchema.pre(/^findByIdAnd/, function (next) {
  this.modifiedAt = Date.now();
  next();
});

module.exports = mongoose.model("Comment", commentSchema);
