import * as controller from "../controller/orgController";
import { Router } from "express";
const router = Router();

router
  .post("/new", controller.createOrg)
  .put("/sync", controller.updateOrg)
  .post("/bulk", controller.bulkRetrieve)
  .get("/", controller.getOrgData);

export default router;
