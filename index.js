const express = require("express");
const cors = require("cors");

const app = express();

// Configurando a resposta em JSON
app.use(express.json());

// Configurando o CORS para liberar acesso ao frontend com React + Vite porta 5173 de acessar a API.
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Configurando a pasta public
app.use(express.static('public'))

// Configurando rotas
const UserRoutes = require("./routes/UserRoutes")

app.use('/users', UserRoutes)

app.listen(4000)
