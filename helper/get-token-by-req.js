const getAuth = require("./get-auth")

const getToken = (req) => {

    const authHeader = getAuth(req)

    const token = authHeader.split(" ")[1]

    return token

}

module.exports = getToken