const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/ApiFeatures");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(User.find({}), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await apiFeatures.query;

  res.status(200).json({
    status: "success",
    total: users.length,
    data: {
      users,
    },
  });
});
exports.updateAllUsers = catchAsync(async (req, res, next) => {
  const updatedUsers = await User.updateMany({}, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    message: "All users have been updated !",
  });
});
exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  await User.deleteMany({});
  res.status(204).json({
    status: "success",
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate({ path: "posts" });
  if (!user) {
    return next(new AppError("User Not Found !", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return new next(
      new AppError("You can NOT update your password from here", 400)
    );
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      profile: req.file.filename,
      age: req.body.age,
      country: req.body.country,
      modifiedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
  });
});
