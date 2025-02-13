# Pivcinc - API REST

## 📖 Introdução
Pivcinc é uma API REST desenvolvida para uma rede social voltada para adictos, permitindo que os usuários interajam por meio de postagens, curtidas e comentários. A API é construída com Node.js e Express, utilizando MongoDB como banco de dados, gerenciado pelo Mongoose. A autenticação dos usuários é feita por meio de tokens JWT.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** – Ambiente de execução JavaScript no servidor.
- **Express** – Framework minimalista para construção de APIs.
- **MongoDB** – Banco de dados NoSQL orientado a documentos.
- **Mongoose** – ODM para modelagem de dados no MongoDB.
- **JSON Web Token (JWT)** – Autenticação segura baseada em tokens.

---

## 🛠️ Instalação

Clone este repositório e instale as dependências:

```sh
$ git clone https://github.com/caiohrmm/pivcinc-backend.git
$ cd pivcinc
$ npm install
```


Para rodar em produção:

```sh
$ npm start
```

---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

```def
MONGO_URI=seu_banco_de_dados
JWT_SECRET=sua_chave_secreta
PORT=3000
```

---

## 🔑 Autenticação

A API utiliza JWT para autenticação. O fluxo de login e registro funciona assim:

1. O usuário se cadastra na plataforma.
2. O sistema gera um token JWT.
3. O usuário usa esse token para acessar os recursos protegidos.

### 🔹 Registro de Usuário

```ghi
POST /api/auth/register
```
**Corpo da requisição:**

```json
{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Resposta esperada:**

```json
{
  "message": "Usuário registrado com sucesso!",
  "token": "eyJhbGciOiJI..."
}
```

### 🔹 Login de Usuário

```ghi
POST /api/auth/login
```
**Corpo da requisição:**

```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Resposta esperada:**

```json
{
  "message": "Login bem-sucedido!",
  "token": "eyJhbGciOiJI..."
}
```

Para acessar rotas protegidas, envie o token JWT no cabeçalho:

```ghi
Authorization: Bearer SEU_TOKEN_AQUI
```

---
