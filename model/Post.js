const mongoose = require("../db/connection");
const { Schema } = mongoose;

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true }, // Adicionando o campo username
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Post = mongoose.model(
  "Post",
  new Schema(
    {
      // Atributos
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      images: [{ type: Array }],
      categories: [{ type: String }],
      likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
      comments: [commentSchema],
    },
    { timestamps: true }
  )
);

module.exports = Post;
