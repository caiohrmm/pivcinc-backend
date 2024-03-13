const router = require("express").Router();

const UserController = require("../controller/UserController");
const checkToken = require("../helper/verify-token");
const { imageUpload } = require("../helper/image-upload");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.patch(
  "/edit/:id",
  checkToken,
  imageUpload.single("image"),
  UserController.editUserById
);

module.exports = router;
