const jwt = require("jsonwebtoken")
require("dotenv").config();

const createUserToken = async (user, req, res) => {

    // Crio o token, através dele posso recuperar todas as informações do usuário logado.
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, `${process.env.SECRET_JWT}`)

    // Retorno o token
    res.status(200).json({
        message: `${user.name} está autenticado no sistema!`,
        token: token,
        userId: user._id,
        user
    })
}

module.exports = createUserToken