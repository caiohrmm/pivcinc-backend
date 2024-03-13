const multer = require("multer");
const path = require("path");

// Configurar um local para armazenamento das imagens
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Como eu posso salvar tanto na pasta de Pets como na de Users, criarei uma variavel let que mudara seu valor
    let folder = "";

    // Se na url incluir users -> Sei q é pra salvar na pasta users
    // Se for pets a mesma coisa

    if (req.baseUrl.includes("post")) {
      folder = "post";
    } else if (req.baseUrl.includes("users")) {
      folder = "user";
    }
    // Agora passo a funcao de callback que enviará o destino
    cb(null, `public/images/${folder}`);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        String(Math.floor(Math.random() * 1000)) +
        path.extname(file.originalname)
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    // Se as imagens nao forem do formato png ou jpg ele dá esse erro.
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error("Por favor, envie imagens no formato JPG ou PNG!"));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };
