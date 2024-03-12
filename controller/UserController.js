const createUserToken = require("../helper/create-user-token");
const getAuth = require("../helper/get-auth");
const getToken = require("../helper/get-token-by-req");
const responseError = require("../helper/response-error");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, password, confirmPassword, phone } = req.body;

    // Validações
    if (!name) {
      responseError("Nome", res);
      return;
    }

    if (!email) {
      responseError("E-mail", res);
      return;
    }

    if (!password) {
      responseError("Senha", res);
      return;
    }

    if (!confirmPassword) {
      responseError("Confirmar senha", res);
      return;
    }

    if (!phone) {
      responseError("Telefone", res);
      return;
    }

    if (password != confirmPassword) {
      responseError(null, res, "As senhas não coincidem!");
      return;
    }

    // Checkar se o usuário existe no sistema
    const userExists = await User.findOne({ email });

    if (userExists) {
      responseError(
        null,
        res,
        "Usuário já cadastrado no sistema. Tente novamente com outro e-mail."
      );
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      responseError("E-mail", res);
      return;
    }

    if (!password) {
      responseError("Senha", res);
      return;
    }

    // Agora o usuario precisa existir.
    const user = await User.findOne({ email });

    if (!user) {
      responseError(
        null,
        res,
        "O usuário não existe! Cadastre-se clickando no botão de registro!"
      );
      return;
    }

    // Ver se a senha passada no body é igual a do banco
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      responseError(null, res, "Senha Inválida!");
      return;
    }

    try {
      await createUserToken(user, req, res);
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }

  static async checkUser(req, res) {
    let currentUser;

    console.log(getAuth(req));

    if (getAuth(req)) {
      const token = getToken(req);

      const decoded = jwt.verify(token, "secretpicinco");

      currentUser = await User.findById({ _id: decoded.id });

      currentUser.password = undefined
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {

    const id = req.params.id

    const user = await User.findById(id).select("-password")


    if (!user) {
      responseError(null, req, "Usuário não encontrado!")
      return
    }

    res.status(200).send(user)
  }

  static async editUserById(req, res) {
    const id = req.params.id

    res.status(200).json({
      mensagemparacorno: "Req para corno"
    })

    
  }
};
