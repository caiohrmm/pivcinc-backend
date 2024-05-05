const mongoose = require("../db/connection");
const { Schema } = mongoose;

const User = mongoose.model(
  "User",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
      followers: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    { timestamps: true }
  )
);

module.exports = User;
