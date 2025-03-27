import { Router } from "express";
import {
  GetAll,
  reg,
  deletesingleExpense,
  Get,
  update,
  GetIndividualApplicant,
  DeleteIndividualApplicant,
  GetIndividualApplicantSingleBill,
  UpdateIndividualApplicantSingleBill,
  showallApprovalOfManager,
  ApprovalOfManager,
  GetAllApprovalOfManger,
  RejectOfManager,
  GetAllRejectedOfManger,
  GetOfManager,
} from "../controllers/expenses.controller.js";
import multer from "multer";
import { loginChecker_verifyuser, restrictTo } from "../helper/Jwt.handle.js";
const expenseroute = Router();
import {
  showallApprovalOfHOD,
  ApprovalOfHOD,
  GetAllApprovalOfHOD,
  RejectOfHOD,
  GetAllRejectedOfHOD,
  GetOfHOD,
} from "../controllers/HOD.controller.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./images/api/Bills");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png/;
  const extName = allowedExtensions.test(file.mimetype);
  if (extName) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG files are allowed."));
  }
};

const upload = multer({ storage, fileFilter });

//CRUD
expenseroute.get("/showall", GetAll);
expenseroute.delete("/:id", deletesingleExpense);
expenseroute.get("/:id", Get);
expenseroute.patch("/:id", upload.single("bills"), update);

//Approval routes Executive
expenseroute.get(
  "/Applicant/bills/final",
  loginChecker_verifyuser,
  restrictTo(["Executive", "Director"]),
  showallApprovalOfHOD
);
expenseroute.get(
  "/Applicant/bills/final/Approved",
  loginChecker_verifyuser,
  restrictTo(["Executive", "Director"]),
  GetAllApprovalOfHOD
);
expenseroute.get(
  "/Applicant/bills/final/Rejected",
  loginChecker_verifyuser,
  restrictTo(["Executive", "Director"]),
  GetAllRejectedOfHOD
);
expenseroute.get(
  "/Applicant/bills/final/:id",
  loginChecker_verifyuser,
  restrictTo(["Executive", "Director"]),
  GetOfHOD
);
expenseroute.patch(
  "/Applicant/bills/final/:id",
  loginChecker_verifyuser,
  restrictTo(["Executive", "Director"]),
  ApprovalOfHOD
);
expenseroute.delete(
  "/Applicant/bills/final/:id",
  loginChecker_verifyuser,
  restrictTo(["Executive", "Director"]),
  RejectOfHOD
);

//Approval routes Supervisor
expenseroute.get(
  "/Applicant/bills/",
  loginChecker_verifyuser,
  restrictTo(["Supervisor", "Director"]),
  showallApprovalOfManager
);
expenseroute.get(
  "/Applicant/bills/Approved",
  loginChecker_verifyuser,
  restrictTo(["Supervisor", "Director"]),
  GetAllApprovalOfManger
);
expenseroute.get(
  "/Applicant/bills/Rejected",
  loginChecker_verifyuser,
  restrictTo(["Supervisor", "Director"]),
  GetAllRejectedOfManger
);
expenseroute.get(
  "/Applicant/bills/:id",
  loginChecker_verifyuser,
  restrictTo(["Supervisor", "Director"]),
  GetOfManager
);
expenseroute.patch(
  "/Applicant/bills/:id",
  loginChecker_verifyuser,
  restrictTo(["Supervisor", "Director"]),
  ApprovalOfManager
);
expenseroute.delete(
  "/Applicant/bills/:id",
  loginChecker_verifyuser,
  restrictTo(["Supervisor", "Director"]),
  RejectOfManager
);

//Applicant Manager HOD Director
expenseroute.post("/reg", loginChecker_verifyuser, upload.single("bills"), reg);
expenseroute.get("/", loginChecker_verifyuser, GetIndividualApplicant);
expenseroute.delete(
  "/Applicant/:id",
  loginChecker_verifyuser,
  DeleteIndividualApplicant
);
expenseroute.get(
  "/Applicant/:id",
  loginChecker_verifyuser,
  GetIndividualApplicantSingleBill
);
expenseroute.patch(
  "/Applicant/:id",
  loginChecker_verifyuser,
  upload.single("bills"),
  UpdateIndividualApplicantSingleBill
);

export default expenseroute;
