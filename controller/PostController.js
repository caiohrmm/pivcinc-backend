const createUserToken = require("../helper/create-user-token");
const getAuth = require("../helper/get-auth");
const getToken = require("../helper/get-token-by-req");
const responseError = require("../helper/response-error");
const Post = require("../model/Post");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const exceptionMessage = require("../helper/exceptions-messages");
const getUserByToken = require("../helper/get-user-by-token");
const { isValidObjectId } = require("mongoose");

module.exports = class PostController {
  static async newPost(req, res) {
    const currentUser = await getUserByToken(getToken(req));

    const id = req.params.id;

    if (!currentUser._id.equals(id)) {
      exceptionMessage(res, 401, "Acesso Negado");
      return;
    }

    const { title, description, categories } = req.body;

    if (!title) {
      exceptionMessage(res, 422, "O título da postagem é obrigatório!");
      return;
    }

    if (!description) {
      exceptionMessage(res, 422, "A descrição da postagem é obrigatória!");
      return;
    }

    const post = new Post({
      title,
      userId: currentUser._id,
      description,
      categories,
      images: [],
    });

    if (req.files) {
      const images = req.files;
      // Percorrer o array de imagens para renomeá-las com o nome que eu quero.
      images.map((image) => {
        post.images.push(image.filename);
      });
    }

    try {
      const newPost = await post.save();
      res.status(201).json({
        message: "Postagem criada com sucesso!",
        newPost,
      });
    } catch (error) {
      exceptionMessage(res, 500, error);
    }
  }

  static async getAllPosts(req, res) {
    // Funcao que vai para a rota de GET para ver todos as postagens do sistema.

    const posts = await Post.find().sort("-createdAt"); // Pega os pets dos mais novos para os mais velhos.

    res.status(200).json({
      posts,
    });
  }

  static async getAllUserPosts(req, res) {
    // Funcao que vai pegar as postagens do usuario do mongodb.

    // Pegando meu usuario baseado no token.
    const currentUser = await getUserByToken(getToken(req));

    const id = req.params.id;

    if (!currentUser._id.equals(id)) {
      exceptionMessage(res, 401, "Acesso Negado");
      return;
    }

    const posts = await Post.find({ userId: currentUser._id });
    // Quando preciso filtrar algum dado de um subdocument do MongoDB eu filtro por ''.
    res.status(200).json({
      posts,
    });
  }

  static async getPostById(req, res) {
    try {
      const id = req.params.id;

      if (!isValidObjectId(id)) { 
        exceptionMessage(res, 422, "ID Inválido!");
        return
      }

      const post = await Post.findById(id);

      if (!post) {
        exceptionMessage(res, 404, "Nenhuma postagem encontrada!");
        return;
      } else {
        res.status(200).json({ post });
      }
    } catch (error) {
      exceptionMessage(res, 422, "ID de postagem inválido!");
    }
  }
};
