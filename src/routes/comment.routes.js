const router = require("express").Router({ mergeParams: true });
const { protect, restrictTo } = require("../controllers/auth.controller");
const commentController = require("../controllers/comment.controller");

// req.params.post OR req.body.post
router
  .route("/")
  .get(commentController.getCommentsForPost)
  .post(protect, commentController.createComment);

router
  .route("/:id")
  .get(commentController.getComment)
  .patch(protect, restrictTo("user", "admin"), commentController.updateComment)
  .delete(
    protect,
    restrictTo("user", "admin"),
    commentController.deleteComment
  );

module.exports = router;
