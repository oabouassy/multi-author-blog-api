const catchAsync = require("../utils/catchAsync");
const Post = require("../models/post.model");
const APIFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/AppError");

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Post.find({}), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();
  const posts = await apiFeatures.query;
  res.status(200).json({
    status: "success",
    total: posts.length,
    data: {
      posts,
    },
  });
});
exports.updateAllPosts = catchAsync(async (req, res, next) => {
  await Post.updateMany({}, req.body, { new: true, runValidators: true });
  res.status(200).json({
    status: "success",
    message: "All posts have been updated succesfully",
  });
});
exports.deleteAllPosts = catchAsync(async (req, res, next) => {
  await Post.deleteMany({});
  res.status(204).json({
    status: "success",
    message: "All posts have been updated succesfully",
  });
});
exports.getPost = catchAsync(async (req, res, next) => {
  let post;
  if (req.query?.fields) {
    post = await Post.findById(req.params.id).select(
      req.query.fields.split(",").join(" ")
    );
  } else {
    post = await Post.findById(req.params.id).select("-__v");
  }
  if (!post) {
    return next(new AppError("Post Not Found !", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});
exports.createPost = catchAsync(async (req, res, next) => {
  let coverImage;
  let blogImages = [];
  if (req.files) {
    if (req.files.coverImage) {
      coverImage = req.files.coverImage[0].filename;
    }
    if (req.files.bodyImages) {
      req.files.bodyImages.forEach((img) => {
        blogImages.push(img.filename);
      });
    }
    req.body.coverImage = coverImage;
    req.body.blogImages = blogImages;
  }
  const post = await Post.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      post,
    },
  });
});
exports.validateUser = catchAsync(async (req, res, next) => {
  if (req.user.role === "user") {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError("Post Not Found !", 404));
    }
    if (!(post.userId.id == req.user.id)) {
      return next(new AppError("You are NOT the owner of this post !", 400));
    }
  }
  next();
});
exports.updatePost = catchAsync(async (req, res, next) => {
  const updatedProps = { ...req.body, modifiedAt: Date.now() };
  const post = await Post.findByIdAndUpdate(req.params.id, updatedProps, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    message: "Post has been updated successfully !",
    data: {
      post,
    },
  });
});
exports.deletePost = catchAsync(async (req, res, next) => {
  await Post.findByIdAndRemove(req.params.id);
  res.status(204).json({
    status: "success",
    data: {
      post: req.post,
    },
  });
});
