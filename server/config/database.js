const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

function db_connect(url) {
  try {
    const uri = encodeURI(url ?? MONGO_URI);
    mongoose.connect(uri, (err) => {
      if (err) return console.error(err);
      console.log(`connected to mongodb`);
    })
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = db_connect;