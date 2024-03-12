const responseError = (attribute, response, message) => {
  if (!message)
    return response
      .status(422)
      .json({ message: `Campo ${attribute} é obrigatório!` });

  return response.status(422).json({ message: message });
};

module.exports = responseError;
