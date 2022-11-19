const dotenv = require("dotenv").config({ path: __dirname + '/../.env' });
const cors = require("cors")
const express = require("express");
const app = express();
const user_router = require("./router/userRouter");
const db_connect = require("./config/database");

db_connect();

app.use(cors({
  origin: [
    "https://tuu-duu.netlify.app",
    "http://localhost:5173" //for development
  ]
}), express.json())


app.use("/api/login", user_router, (req, res) => {
  res.send({
    message: "Hello frontend!"
  })
})

app.use("/", (req, res) => {
  res.send({ message: "hello there" })
})

app.listen(2005, () => {
  console.log("app listening on port 2005")
})
