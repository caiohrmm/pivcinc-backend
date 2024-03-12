const mongoose = require("../db/connection");
const { Schema } = mongoose;

const Post = mongoose.model(
  "Post",
  new Schema(
    {
      // Atributos
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      images: [{ type: String }],
      categories: [{ type: String }],
      likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
      comments: [
        {
          user: { type: Schema.Types.ObjectId, ref: "User" },
          text: { type: String, required: true },
          date: { type: Date, default: Date.now },
        },
      ],
    },
    { timestamps: true }
  )
);

module.exports = Post;
