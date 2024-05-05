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
router.get("/myposts", checkToken, PostController.getAllUserPosts);
router.get("/:id", checkToken, PostController.getPostById);
router.delete("/deletePostById/:id", checkToken, PostController.deletePostById);
router.patch('/edit/:id', checkToken, imageUpload.array('images'), PostController.updatePostById)
router.post('/likepost/:id', checkToken, PostController.likePostById)
router.delete('/unlikepost/:id', checkToken, PostController.unlikePostById)
router.post('/comment/:id', checkToken, PostController.commentToPostById)



// Rota para atualizar um comentário específico
router.patch('/posts/:postId/comments/:commentId', checkToken, PostController.updateComment);



module.exports = router;
