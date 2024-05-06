const router = require("express").Router();

const UserController = require("../controller/UserController");
const checkToken = require("../helper/verify-token");
const { imageUpload } = require("../helper/image-upload");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/checkiffollowing/:id", checkToken, UserController.checkIfFollowing)
router.get("/:id", UserController.getUserById);
router.patch(
  "/edit/:id",
  checkToken,
  imageUpload.single("image"),
  UserController.editUserById
);
router.post("/follow/:id", checkToken, UserController.followUser);
router.post("/unfollow/:id", checkToken, UserController.unfollowUser);
router.get("/posts/following", checkToken, UserController.postsFollowing)
router.get("/checkiffollowing/:id", checkToken, UserController.postsFollowing)


module.exports = router;
