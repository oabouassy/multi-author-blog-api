const router = require("express").Router();
const { upload } = require("../configs/fileUpload");
const { protect, restrictTo } = require("../controllers/auth.controller");
const postController = require("../controllers/posts.controller");
const commentRoutes = require("./comment.routes");

router.use("/:post/comments", commentRoutes);

router
  .route("/")
  .get(postController.getAllPosts)
  .post(
    protect,
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "bodyImages", maxCount: 3 },
    ]),
    postController.createPost
  )
  .patch(protect, restrictTo("admin"), postController.updateAllPosts)
  .delete(protect, restrictTo("admin"), postController.deleteAllPosts);

router
  .route("/:id")
  .get(postController.getPost)
  .patch(protect, postController.validateUser, postController.updatePost)
  .delete(protect, postController.validateUser, postController.deletePost);

module.exports = router;
