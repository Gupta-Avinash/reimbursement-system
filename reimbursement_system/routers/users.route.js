import { Router } from "express";
import { loginChecker_verifyuser, restrictTo } from "../helper/Jwt.handle.js";
import {
  Registration,
  GetAll,
  DeleteSingleUser,
  Get,
  update,
  login,
  GetAllActiveUser,
  GetAllInactiveUser,
} from "../controllers/users.controller.js";

const userrouter = Router();

// crud operation
userrouter.post(
  "/reg",
  loginChecker_verifyuser,
  restrictTo(["Director"]),
  Registration
);
userrouter.get(
  "/showall",
  loginChecker_verifyuser,
  restrictTo(["Director"]),
  GetAll
);
userrouter.delete(
  "/:id",
  loginChecker_verifyuser,
  restrictTo(["Director"]),
  DeleteSingleUser
);
userrouter.get("/:id", loginChecker_verifyuser, restrictTo(["Director"]), Get);
userrouter.patch(
  "/:id",
  loginChecker_verifyuser,
  restrictTo(["Director"]),
  update
);

//login
userrouter.post("/login", login);

//Active and inactive user lists
userrouter.get("/active_user", GetAllActiveUser);
userrouter.get("/inactive_user", GetAllInactiveUser);
export default userrouter;
