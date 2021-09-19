const express = require("express");
const path = require("path");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const ErrorHandling = require("./middlewares/ErrorHandling");
const AppError = require("./utils/AppError");
const cookieParser = require("cookie-parser");
const app = express();

// global middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors());
app.use(cookieParser());

// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);

// 404 not found
app.all("*", (req, res, next) => {
  next(new AppError("404, route not found !", 404));
});

// error handling middleware
app.use(ErrorHandling);
module.exports = app;
