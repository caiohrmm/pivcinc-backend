const getAuth = (req) => {
    return req.headers.authorization
}


module.exports = getAuth