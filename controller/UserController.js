const createUserToken = require("../helper/create-user-token");
const getAuth = require("../helper/get-auth");
const getToken = require("../helper/get-token-by-req");
const responseError = require("../helper/response-error");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const exceptionMessage = require("../helper/exceptions-messages");
const getUserByToken = require("../helper/get-user-by-token");

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
      exceptionMessage(res, 500, error);
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
      exceptionMessage(res, 500, error);
    }
  }

  static async checkUser(req, res) {
    let currentUser;

    if (getAuth(req)) {
      const token = getToken(req);

      const decoded = jwt.verify(token, "secretpicinco");

      currentUser = await User.findById({ _id: decoded.id });

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    try {
      const id = req.params.id;

      const user = await User.findById(id).select("-password");

      if (!user) {
        exceptionMessage(res, 422, "Usuário não encontrado!");
        return;
      } else {
        res.status(200).json({ user });
      }
    } catch (error) {
      exceptionMessage(res, 422, "ID de usuário inválido!");
    }
  }

  static async editUserById(req, res) {
    const { name, email, phone, password, confirmPassword } = req.body;

    // Checkando se o usuario existe
    const token = getToken(req); // Pega o token do usuário
    const user = await getUserByToken(token);

    const id = req.params.id;

    if (!user._id.equals(id)) {
      exceptionMessage(res, 401, "Acesso Negado");
      return;
    }

    if (req.file) {
      user.image = req.file.filename;
    }

    // Validação dos dados, igual na do registro.
    if (!name) {
      exceptionMessage(res, 422, "O nome é obrigatório!");
      return;
    }

    user.name = name;

    // Se veio um email, preciso de outra validacao, pois o email editado pode ser de alguem do sistema.
    if (!email) {
      exceptionMessage(res, 422, "O e-mail é obrigatório!");
      return;
    }
    // Check email
    const emailExists = await User.findOne({ email });

    if (email !== user.email && emailExists) {
      exceptionMessage(
        res,
        422,
        "Esse e-mail já está cadastrado no nosso sistema!"
      );
      return;
    }
    user.email = email;

    // Verificar se a senha do campo password e confirmpassword sao identicas
    if (password !== confirmPassword) {
      exceptionMessage(res, 422, "As senhas não são iguais!");
      return;
    } else if (password === confirmPassword && password != null) {
      // Se a senha for igual a senha confirmada e a senha for diferente de nula, eu crio uma nova senha.
      // Criando senha criptografada
      const salt = await bcrypt.genSalt(12); // Adiciona mais 12 caracteres para a senha
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }

    if (!phone) {
      exceptionMessage(res, 422, "O telefone é obrigatório!");
      return;
    }
    user.phone = phone;

    try {
      // Atualizar o usuario com o user que criamos acima
      await User.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          $set: user,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        message: "Usuário atualizado com sucesso!",
      });
    } catch (error) {
      exceptionMessage(res, 500, error);
      return;
    }
  }
};
