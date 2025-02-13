const mongoose = require("mongoose");
require("dotenv").config();

async function main() {
  await mongoose.connect(`${process.env.MONGO_URI}`);
  console.log("Conectou ao Mongoose!");
}

main().catch((error) => console.log(error));

module.exports = mongoose;
