const Comment = require("../models/comment.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.createComment = catchAsync(async (req, res, next) => {
  const post = req.params.post || req.body.post;
  const comment = await Comment.create({
    body: req.body.body,
    user: req.user._id,
    post,
  });
  res.status(200).json({
    status: "success",
    date: {
      comment,
    },
  });
});
exports.getCommentsForPost = catchAsync(async (req, res, next) => {
  const post = req.params.post || req.body.post;
  const comments = await Comment.find({ post });
  res.status(200).json({
    status: "success",
    total: comments.length,
    data: {
      comments,
    },
  });
});
exports.getComment = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const comment = await Comment.findById(id);
  res.status(200).json({
    status: "success",
    date: {
      comment,
    },
  });
});
exports.updateComment = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const comment = await Comment.findByIdAndUpdate(
    id,
    {
      body: req.body.body,
      modifiedAt: Date.now(),
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    date: {
      comment,
    },
  });
});
exports.deleteComment = catchAsync(async (req, res, next) => {
  await Comment.deleteOne({ _id: req.params.id });
  res.status(204).json({
    status: "success",
  });
});
