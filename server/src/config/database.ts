const dotenv = require("dotenv").config();
import  mongoose from "mongoose";
mongoose.set("strictQuery", true);

const { MONGO_URI } = process.env;

async function db_connect(url?: string) {
  try {
    const uri = encodeURI(url ?? MONGO_URI ?? "");
    mongoose.connect(uri, (err) => {
      if (err) return console.error(err);
      console.log(`connected to mongodb`);
    })
  } catch (error) {
    console.error(error);
  }
}

export default db_connect;