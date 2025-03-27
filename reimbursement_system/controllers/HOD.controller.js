import mongoose from "mongoose";
import expenses from "../models/Expenses.model.js";
import users from "../models/user.model.js";
import customers from "../models/customer.model.js";

const showallApprovalOfHOD = async (req, res) => {
  try {
    await expenses
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "Expense_raiser",
            foreignField: "_id",
            as: "usersdata",
          },
        },
        {
          $match: {
            $and: [
              {
                Expense_raiser: {
                  $ne: new mongoose.Types.ObjectId(req.user.ID),
                },
              },
              {
                Deleted: false,
              },
              {
                usersdata: {
                  $elemMatch: {
                    Activate: true,
                    Deleted: false,
                  },
                },
              },
              {
                Approval_HOD: false,
                Approval_Manager: true,
                Rejected_Manager: false,
                Rejected_HOD: false,
                Deleted: false,
              },
            ],
          },
        },
        {
          $project: {
            Expense_date: 1,
            Expense_type: 1,
            Location_from: 1,
            Location_to: 1,
            Amount: 1,
            Description: 1,
            Company_name: 1,
            Bill_photo: 1,
            Address:1,
            user: {
              $map: {
                input: "$usersdata",
                as: "filterdata",
                in: {
                  Name: "$$filterdata.Name",
                  Email: "$$filterdata.Email",
                  Organization: "$$filterdata.Organization",
                  Roles: "$$filterdata.Roles",
                },
              },
            },
          },
        },
      ])
      .then((re) => {
        return res.status(200).json({ message: re });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ message: "failed to fetch the Employees bills" });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const ApprovalOfHOD = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectid = new mongoose.Types.ObjectId(req.params.id);
      let isBillExist = await expenses.findOne({
        _id: objectid,
        Approval_HOD: false,
        Approval_Manager: true,
        Rejected_HOD: false,
        Rejected_Manager: false,
        Deleted: false,
      });
      if (isBillExist) {
        await expenses
          .findOneAndUpdate(
            {
              _id: objectid,
              Approval_HOD: false,
              Approval_Manager: true,
              Rejected_HOD: false,
              Rejected_Manager: false,
              Deleted: false,
            },
            {
              Approval_HOD: true,
            }
          )
          .then((re) => {
            return res
              .status(200)
              .json({ message: "billed approved successfully" });
          })
          .catch((err) => {
            return res
              .status(400)
              .json({ message: "failed to Approve the bill" });
          });
      } else {
        return res.status(400).json({ message: "Bill does not exist" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetAllApprovalOfHOD = async (req, res) => {
  try {
    await expenses
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "Expense_raiser",
            foreignField: "_id",
            as: "usersdata",
          },
        },
        {
          $match: {
            $and: [
              {
                Expense_raiser: {
                  $ne: new mongoose.Types.ObjectId(req.user.ID),
                },
              },
              {
                Deleted: false,
              },
              {
                usersdata: {
                  $elemMatch: {
                    Activate: true,
                    Deleted: false,
                  },
                },
              },
              {
                Approval_HOD: true,
                Approval_Manager: true,
                Rejected_Manager: false,
                Rejected_HOD: false,
              },
            ],
          },
        },
        {
          $project: {
            Expense_date: 1,
            Expense_type: 1,
            Location_from: 1,
            Location_to: 1,
            Amount: 1,
            Description: 1,
            Company_name: 1,
            Bill_photo: 1,
            Address:1,
            user: {
              $map: {
                input: "$usersdata",
                as: "filterdata",
                in: {
                  Name: "$$filterdata.Name",
                  Email: "$$filterdata.Email",
                  Organization: "$$filterdata.Organization",
                  Roles: "$$filterdata.Roles",
                },
              },
            },
          },
        },
      ])
      .then((re) => {
        return res.status(200).json({ message: re });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ message: "failed to fetch the Employees bills" });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const RejectOfHOD = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectid = new mongoose.Types.ObjectId(req.params.id);
      let isBillExist = await expenses.findOne({
        _id: objectid,
        Approval_HOD: false,
        Approval_Manager: true,
        Rejected_HOD: false,
        Rejected_Manager: false,
        Deleted: false,
      });
      if (isBillExist) {
        await expenses
          .findOneAndUpdate(
            {
              _id: objectid,
              Approval_HOD: false,
              Approval_Manager: true,
              Rejected_HOD: false,
              Rejected_Manager: false,
              Deleted: false,
            },
            {
              Rejected_HOD: true,
            }
          )
          .then((re) => {
            return res
              .status(200)
              .json({ message: "bill rejected successfully" });
          })
          .catch((err) => {
            return res
              .status(400)
              .json({ message: "failed to Reject the bill" });
          });
      } else {
        return res.status(400).json({ message: "Bill does not exist" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetAllRejectedOfHOD = async (req, res) => {
  try {
    await expenses
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "Expense_raiser",
            foreignField: "_id",
            as: "usersdata",
          },
        },
        {
          $match: {
            $and: [
              {
                Expense_raiser: {
                  $ne: new mongoose.Types.ObjectId(req.user.ID),
                },
              },
              {
                Deleted: false,
              },
              {
                usersdata: {
                  $elemMatch: {
                    Activate: true,
                    Deleted: false,
                  },
                },
              },
              {
                Approval_HOD: false,
                Approval_Manager: true,
                Rejected_Manager: false,
                Rejected_HOD: true,
              },
            ],
          },
        },
        {
          $project: {
            Expense_date: 1,
            Expense_type: 1,
            Location_from: 1,
            Location_to: 1,
            Amount: 1,
            Description: 1,
            Company_name: 1,
            Bill_photo: 1,
            Address:1,
            user: {
              $map: {
                input: "$usersdata",
                as: "filterdata",
                in: {
                  Name: "$$filterdata.Name",
                  Email: "$$filterdata.Email",
                  Organization: "$$filterdata.Organization",
                  Roles: "$$filterdata.Roles",
                },
              },
            },
          },
        },
      ])
      .then((re) => {
        return res.status(200).json({ message: re });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ message: "failed to fetch the Employees bills" });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetOfHOD = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectid = new mongoose.Types.ObjectId(req.params.id);
      let isBillExist = await expenses.findOne({
        _id: objectid,
        Approval_HOD: false,
        Approval_Manager: true,
        Rejected_HOD: false,
        Rejected_Manager: false,
        Deleted: false,
      });
      if (isBillExist) {
        await expenses
          .findOne({
            _id: objectid,
            Approval_HOD: false,
            Approval_Manager: true,
            Rejected_HOD: false,
            Rejected_Manager: false,
            Deleted: false,
          })
          .populate({
            path: "Expense_raiser",
            select: "Name Email Organization Department",
          })
          .then((re) => {
            return res.status(200).json({ message: re });
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(400)
              .json({ message: "failed to fetch single bill" });
          });
      } else {
        return res.status(400).json({ message: "Bill does not exist" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  showallApprovalOfHOD,
  ApprovalOfHOD,
  GetAllApprovalOfHOD,
  RejectOfHOD,
  GetAllRejectedOfHOD,
  GetOfHOD,
};
