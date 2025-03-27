import { Router } from "express";
import { loginChecker_verifyuser, restrictTo } from "../helper/Jwt.handle.js";
import {
  Register,
  GetAll,
  Get,
  update,
  DeletedSigleCustomer,
} from "../controllers/customer.controller.js";

const customerrouter = Router();

//CRUD
customerrouter.post(
  "/reg",
  loginChecker_verifyuser,
  restrictTo(["Director"]),
  Register
);
customerrouter.get("/showcustomer", loginChecker_verifyuser, GetAll);
customerrouter.get(
  "/show",
  loginChecker_verifyuser,
  restrictTo(["Director"]),
  GetAll
);
customerrouter.get(
  "/showall",
  loginChecker_verifyuser,
  GetAll
);
customerrouter.get(
  "/:id",
  loginChecker_verifyuser,
  restrictTo(["Director"]),
  Get
);
customerrouter.delete(
  "/:id",
  loginChecker_verifyuser,
  restrictTo(["Director"]),
  DeletedSigleCustomer
);
customerrouter.patch(
  "/:id",
  loginChecker_verifyuser,
  restrictTo(["Director"]),
  update
);

//

export default customerrouter;
