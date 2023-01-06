import * as controller from "@user/controller/projectController";
import { Router } from "express";
const router = Router();

router
  // query params: {_id}
  .get("/", controller.getProjects)
  // .get('/projects/:projectId', controller.getProject)
  // body: {_id, project_data}
  .post("/", controller.addProject)
  // body : {_id, project_data}
  .put("/", controller.editProject)
  // query params: {_id, project_id}
  .delete("/", controller.deleteProject);

export default router;
