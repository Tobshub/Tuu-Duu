import * as controller from "@user/controller/userController";
import projectRouter from "./projectRouter";
import { Router } from "express";
const router = Router();

router
  .get("/", (req, res) => {
    res.send({
      message: "API endpoint get request",
    });
  })
  .post("/login", controller.getUserByEmail)
  .post("/sign_up", controller.addNewUser)
  .put("/update", controller.updateUser)
  // use project router for routing project endpoints
  .use("/projects", projectRouter)
  .get("/orgs", (req, res) => {
    console.log("getting orgs that user is a part of...");
    res.send({ message: "getting orgs that user is a part of..." });
  })
  .put("/orgs/new_ref", controller.addOrgToUser);
// delete user

export default router;
