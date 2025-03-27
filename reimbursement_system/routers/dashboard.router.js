import {
  dashboard,
  Excelfile_Download,
} from "../controllers/Dashboard.Controller.js";
import { Router } from "express";
import { loginChecker_verifyuser, restrictTo } from "../helper/Jwt.handle.js";

const DashboardRouter = Router();
//Director Dashboard
DashboardRouter.get(
  "/",
  loginChecker_verifyuser,
  restrictTo(["Director"]),
  dashboard
); //  loginChecker_verifyuser, restrictTo(["Director"]),
DashboardRouter.post(
  "/download",
  loginChecker_verifyuser,
  restrictTo(["Director"]),
  Excelfile_Download
); //  loginChecker_verifyuser, restrictTo(["Director"]),

export default DashboardRouter;
