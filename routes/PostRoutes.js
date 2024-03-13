const router = require("express").Router();

const PostController = require("../controller/PostController");
const checkToken = require("../helper/verify-token");
const { imageUpload } = require("../helper/image-upload");

// Criar uma postagem
router.post(
  "/newpost/:id",
  checkToken,
  imageUpload.array("images"),
  PostController.newPost
);

// Ver todas as postagens, não precisa de autenticação
router.get("/", PostController.getAllPosts);
router.get("/myposts/:id", checkToken, PostController.getAllUserPosts);
router.get("/:id", checkToken, PostController.getPostById);


module.exports = router;
