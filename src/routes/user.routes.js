const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const usersController = require("../controllers/users.controller");
const { upload } = require("../configs/fileUpload");

// Auth
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// CRUD

router
  .route("/")
  .get(usersController.getAllUsers)
  .patch(usersController.updateAllUsers)
  .delete(usersController.deleteAllUsers);

router
  .route("/:id")
  .get(usersController.getUser)
  .patch(upload.single("profile"), usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
