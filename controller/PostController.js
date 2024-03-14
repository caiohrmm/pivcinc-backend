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
        return;
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

  static async deletePostById(req, res) {
    const id = req.params.id;

    // Verifica se existe esse ID no banco.
    if (!isValidObjectId(id)) {
      exceptionMessage(res, 422, "ID Inválido!");
      return;
    }

    // Checkar se existe uma postagem no id
    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({
        message: "Não existe nenhuma postagem cadastrada com esse ID!!",
      });
      return;
    }

    // Checkar se o usuario que está logado registrou o post
    const user = await getUserByToken(getToken(req));

    // Fazer uma comparacao se o id do usuario está cadastrado no subdocument da post.
    if (user._id.toString() !== post.userId.toString()) {
      exceptionMessage(
        res,
        422,
        "Houve um problema para processar a remoção. Tente novamente!"
      );
      return;
    }

    try {
      await Post.findByIdAndDelete(id);
      res.status(200).json({
        message: `A postagem ${post.title} foi removido com sucesso!`,
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async updatePostById(req, res) {
    // Funcao que irá atualizar a postagem baseada no id
    const id = req.params.id;

    // Verifica se existe esse ID no banco.
    if (!isValidObjectId(id)) {
      exceptionMessage(res, 422, "ID Inválido!");
      return;
    }

    const { title, description, categories } = req.body;

    const images = req.files;

    const updatedData = {};

    const post = await Post.findById(id);

    if (!post) {
      exceptionMessage(res, 404, "Postagem não encontrada!");
      return;
    }

    const user = await getUserByToken(getToken(req));

    if (user._id.toString() !== post.userId.toString()) {
      exceptionMessage(
        res,
        422,
        "Houve um problema para processar a edição. Tente novamente!"
      );
      return;
    }

    if (!title) {
      exceptionMessage(res, 422, "O título é obrigatório!");
      return;
    } else {
      updatedData.title = title;
    }

    if (!description) {
      exceptionMessage(res, 422, "O título é obrigatório!");
      return;
    } else {
      updatedData.description = description;
    }

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      exceptionMessage(
        res,
        422,
        "As categorias são obrigatórias e devem ser fornecidas como um array não vazio!"
      );
      return;
    } else {
      updatedData.categories = categories;
    }

    if (images.length > 0) {
      updatedData.images = [];
      images.map((image) => {
        updatedData.images.push(image.filename);
      });
    }

    // Se passar por todas as validações ele atualiza o post
    try {
      await Post.findByIdAndUpdate(id, updatedData);
      res
        .status(200)
        .json({ message: `A postagem foi atualizada com sucesso.` });
    } catch (error) {
      console.log(error);
    }
  }

  static async likePostById(req, res) {
    try {
      const user = await getUserByToken(getToken(req));

      const postId = req.params.id;

      if (!isValidObjectId(postId)) {
        exceptionMessage(res, 422, "ID Inválido!");
        return;
      }

      const post = await Post.findById(postId);

      if (!post) {
        exceptionMessage(res, 404, "Postagem não encontrada!");
        return;
      }

      // Verifique se o usuário já curtiu o post
      if (post.likes.includes(user._id)) {
        // Se o usuário já curtiu, remova a curtida
        post.likes.pull(user._id);
      } else {
        // Caso contrário, adicione a curtida
        post.likes.push(user._id);
      }

      // Salve as alterações
      await post.save();

      res.status(200).json({ message: "Curtida atualizada com sucesso", post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ocorreu um erro ao curtir o post" });
    }
  }

  static async commentToPostById(req, res) {
    try {
      const { text } = req.body;
      const postId = req.params.id;

      if (!isValidObjectId(postId)) {
        exceptionMessage(res, 422, "ID Inválido!");
        return;
      }
      const post = await Post.findById(postId);
      const user = await getUserByToken(getToken(req))

      if (!post) {
        return res.status(404).json({ message: "Post não encontrado" });
      }

      // Adicione o comentário à postagem
      post.comments.push({ userId: user._id, username: user.name, text });

      // Salve as alterações
      await post.save();

      res
        .status(201)
        .json({ message: "Comentário adicionado com sucesso", post });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Ocorreu um erro ao adicionar o comentário" });
    }
  }
};
