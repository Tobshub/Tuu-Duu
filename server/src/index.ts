import { config } from "dotenv";
import cors from "cors";
import express from "express";
import db_connect from "./config/database";
import api_router from "./api";
config();

const app = express();

const { NODE_ENV_USER } = process.env;

db_connect();

app.use(
  cors({
    origin:
      NODE_ENV_USER === "development" ? "*" : "https://tuu-duu.netlify.app",
  }),
  express.json()
);

app.use("/api", api_router);

app.use("/", (req, res) => {
  res.send({ message: "request received" });
});

app.listen(2005, () => {
  console.log("app listening on port 2005");
});
