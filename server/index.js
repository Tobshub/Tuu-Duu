const dotenv = require("dotenv").config({ path: __dirname + '/../.env' });
const fs = require("fs")
const cors = require("cors")
const express = require("express");
const app = express();
const user_router = require("./router/userRouter");
const db_connect = require("./config/database");

db_connect();

app.use(cors(), express.json())


app.use("/api/login", user_router, (req, res) => {
  res.send({
    message: "Hello react!"
  })
})

app.use("/", (req, res) => {
  res.send({ message: "hello there" })
})

app.listen(2005, () => {
  console.log("app listening on port 2005")
})