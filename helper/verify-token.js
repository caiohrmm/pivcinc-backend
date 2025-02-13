const jwt = require("jsonwebtoken");
const getAuth = require("./get-auth");
const getToken = require("./get-token-by-req");
const exceptionMessage = require("./exceptions-messages");
require("dotenv").config();

const checkToken = (req, res, next) => {
  if (!getAuth(req)) return exceptionMessage(res, 401, "Acesso Negado!");

  const token = getToken(req);

  if (!token) return exceptionMessage(res, 401, "Acesso Negado!");

  try {
    const verified = jwt.verify(token, `${process.env.SECRET_JWT}`);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({
      message: "Token Inválido!",
    });
  }
};

module.exports = checkToken;
