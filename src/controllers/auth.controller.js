const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { signToken, checkToken } = require("../utils/jwt");
const { promisify } = require("util");

const createSendToken = (user, res, statusCode) => {
  const token = signToken(user._id);
  user.password = undefined;
  res.cookie("jwt_token", token, {
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.status(statusCode).json({
    status: "success",
    token: token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  createSendToken(user, res, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email: email }).select("+password");
  if (!user || !(await user.isCorrectPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, res, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies?.jwt_token) {
    token = req.cookies.jwt_token;
  } else if (req.headers.authentication) {
    token = req.headers.authentication;
  }
  if (!token) {
    return next(new AppError("Please sign in first !"));
  }
  const payload = checkToken(token);
  const currentUser = await User.findById(payload.id);
  if (currentUser.passwordChangedAfterToken(payload.iat)) {
    return next(
      new AppError(
        "You reseted your password after taking this token, sign in again to get a fresh one !",
        400
      )
    );
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are NOT authorized to access this resource !", 400)
      );
    }
    next();
  };
};

exports.signOut = (req, res, next) => {
  res.cookie("jwt_token", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json("You have successfully logged out !");
};
