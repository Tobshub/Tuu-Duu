import { Router } from "express";
import user_router from "./user/router/userRouter";
import org_router from "./org/router/orgRouter";

const api_router = Router();

api_router
  .use("/user", user_router, (req, res) => {
    res.send({
      message: "API endpoint",
    });
  })
  .use("/org", org_router, (req, res) => {
    res.send({
      message: "API endpoint",
    });
  });

export default api_router;
