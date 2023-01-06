import * as controller from "../controller/userController";
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
  // query params: {_id}
  .get("/projects", controller.getProjects)
  // .get('/projects/:projectId', controller.getProject)
  // body: {_id, project_data}
  .post("/projects", controller.addProject)
  // body : {_id, project_data}
  .put("/projects", controller.editProject)
  // query params: {_id, project_id}
  .delete("/projects", controller.deleteProject)

  .get("/orgs", (req, res) => {
    console.log("getting orgs that user is a part of...");
    res.send({ message: "getting orgs that user is a part of..." });
  })
  .put("/orgs/new_ref", controller.addOrgToUser);
// delete user

export default router;
