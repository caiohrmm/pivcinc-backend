const jwt = require("jsonwebtoken");
const getAuth = require("./get-auth");
const getToken = require("./get-token-by-req");

const checkToken = (req, res, next) => {
  if (!getAuth(req))
    return res.status(401).json({
      message: "Acesso Negado!",
    });

  const token = getToken(req);

  if (!token)
    return res.status(401).json({
      message: "Acesso Negado!",
    });

  try {
    const verified = jwt.verify(token, "secretpicinco");
    req.user = verified
    next()
  } catch (error) {
    res.status(400).json({
        message: "Token Inválido!"
    })
  }
};

module.exports = checkToken