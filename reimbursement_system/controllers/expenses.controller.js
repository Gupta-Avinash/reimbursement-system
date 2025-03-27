import mongoose from "mongoose";
import expenses from "../models/Expenses.model.js";
import users from "../models/user.model.js";
import customers from "../models/customer.model.js";

// CRUD on  ADMIN EXPENSES
const reg = async (req, res) => {
  const {
    customer,
    department,
    expense_date,
    vehicleType,
    Address,
    expenseType,
    amount,
    description,
    companyName,
    from,
    to,
    otherDetails,
  } = req.body;
  try {
    if (
      mongoose.Types.ObjectId.isValid(customer) &&
      mongoose.Types.ObjectId.isValid(req.user.ID)
    ) {
      let customerobject = new mongoose.Types.ObjectId(customer);
      let userobject = new mongoose.Types.ObjectId(req.user.ID);
      const isUserExist = await users.findOne({
        _id: userobject,
        Deleted: false,
        Activate: true,
      });
      const isCustomerExist = await customers.findOne({
        _id: customerobject,
        Deleted: false,
        Activate: true,
      });
      if (isCustomerExist && isUserExist) {
        await expenses
          .create({
            Customer: customerobject,
            Expense_raiser: userobject,
            Department: department,
            Expense_date: expense_date,
            Expense_type: expenseType,
            Address: Address,
            Location_from: from || "N/A",
            Location_to: to || "N/A",
            Amount: amount,
            Vehicle: vehicleType || "N/A",
            Description: description,
            Company_name: companyName,
            Bill_photo: req.file.filename,
            Otherinfo: otherDetails,
          })
          .then((re) => {
            return res
              .status(200)
              .json({ message: "Reimbursement bill uploaded successfully" });
          })
          .catch((err) => {
            return res.status(400).json({ message: "failed to upload bill " });
          });
      } else {
        return res
          .status(400)
          .json({ message: "customer or user does not exist" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetAll = async (req, res) => {
  try {
    await expenses
      .find({ Deleted: false })
      .then((re) => {
        return res.status(200).json({ message: re });
      })
      .catch((err) => {
        return res.status(400).json({ message: "failed to find the bills" });
      });
  } catch (error) {
    return res.status(500).jsong({ message: "Internal server error" });
  }
};

const deletesingleExpense = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectid = new mongoose.Types.ObjectId(req.params.id);
      let isExpenseExist = await expenses.findOne({ _id: objectid });
      if (isExpenseExist) {
        await expenses
          .findOneAndUpdate(
            { _id: objectid },
            {
              Deleted: true,
            }
          )
          .then((re) => {
            return res
              .status(200)
              .json({ message: "expenses deleted successfully" });
          })
          .catch((err) => {
            return res.status(400).json({ message: "failed to delete user" });
          });
      } else {
        return res.status(400).json({ message: "Expense does not exist" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const Get = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectId = new mongoose.Types.ObjectId(req.params.id);
      await expenses.findOne({ _id: objectId, Deleted: false }).then((re) => {
        return res.status(200).json({ message: re });
      });
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const update = async (req, res) => {
  try {
    const {
      customer,
      expense_raiser,
      department,
      expense_date,
      expense_type,
      amount,
      Address,
      description,
      company_name,
    } = req.body;
    if (
      mongoose.Types.ObjectId.isValid(req.params.id) &&
      mongoose.Types.ObjectId.isValid(customer) &&
      mongoose.Types.ObjectId.isValid(expense_raiser)
    ) {
      let objectId = new mongoose.Types.ObjectId(req.params.id);
      let customerobjectId = new mongoose.Types.ObjectId(customer);
      let userobjectId = new mongoose.Types.ObjectId(expense_raiser);
      let isExpenseExist = await expenses.findOne({
        _id: objectId,
        Deleted: false,
      });
      let isUserExist = await users.findOne({
        _id: userobjectId,
        Deleted: false,
        Activate: true,
      });
      let isCustomerExist = await customers.findOne({
        _id: customerobjectId,
        Deleted: false,
        Activate: true,
      });
      console.log(isExpenseExist, isCustomerExist, isUserExist);
      if (isExpenseExist && isUserExist && isCustomerExist) {
        await expenses
          .findOneAndUpdate(
            {
              _id: objectId,
              Deleted: false,
            },
            {
              Customer: customerobjectId,
              Expense_raiser: userobjectId,
              Department: department,
              Expense_date: expense_date,
              Expense_type: expense_type,
              Location_from: "andheri",
              Location_to: "Bandra",
              Amount: amount,
              Description: description,
              Company_name: company_name,
              Bill_photo: req.file.filename,
            }
          )
          .then((re) => {
            return res
              .status(200)
              .json({ message: "bill updated successfully" });
          })
          .catch((err) => {
            return res
              .status(400)
              .json({ message: "failed to update the bills" });
          });
      } else {
        return res.status(400).json({ message: "bill does not exits" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// CRUD on INDIVIDUAL EXPENSES

const GetIndividualApplicant = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.user.ID)) {
      let objectId = new mongoose.Types.ObjectId(req.user.ID);
      await expenses
        .find({ Expense_raiser: objectId, Deleted: false })
        .populate({ path: "Expense_raiser", select: "Name" })
        .populate({ path: "Customer", select: "Name" })
        .then((re) => {
          return res.status(200).json({ message: re });
        })
        .catch((err) => {
          return res.status(400).json({ message: "failed to fetch the bills" });
        });
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteIndividualApplicant = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectId = new mongoose.Types.ObjectId(req.params.id);
      let userobjectId = new mongoose.Types.ObjectId(req.user.ID);
      let isExpenseExist = await expenses.findOne({
        _id: objectId,
        Deleted: false,
      });
      console.log(isExpenseExist);
      if (isExpenseExist) {
        await expenses
          .findOneAndUpdate(
            {
              _id: req.params.id,
              Expense_raiser: userobjectId,
              Approval_HOD: false,
              Rejected_HOD: false,
              Approval_Manager: false,
              Rejected_Manager: false,
            },
            { Deleted: true }
          )
          .then((re) => {
            console.log(re);
            return res
              .status(200)
              .json({ message: "expense Deleted successfully" });
          })
          .catch((err) => {
            return res.status(400).json({ message: "failed to delete bill" });
          });
      } else {
        return res.status(400).json({ message: "failed to delete bill" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Errror" });
  }
};

const GetIndividualApplicantSingleBill = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectId = new mongoose.Types.ObjectId(req.params.id);
      let userobjectId = new mongoose.Types.ObjectId(req.user.ID);
      let isExpenseExist = await expenses.findOne({
        _id: objectId,
        Deleted: false,
        Approval_HOD: false,
        Rejected_HOD: false,
        Approval_Manager: false,
        Rejected_Manager: false,
      });
      console.log(isExpenseExist);
      if (isExpenseExist) {
        await expenses
          .findOne({
            _id: req.params.id,
            Expense_raiser: userobjectId,
            Deleted: false,
          })
          .then((re) => {
            return res.status(200).json({ message: re });
          })
          .catch((err) => {
            return res.status(400).json({ message: "failed to fetch bill" });
          });
      } else {
        return res.status(400).json({ message: "bill does not exist" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const UpdateIndividualApplicantSingleBill = async (req, res) => {
  try {
    let fileUrl = req.file ? req.file.filename : undefined;
    const {
      customer,
      department,
      expense_date,
      expenseType,
      amount,
      description,
      companyName,
      to,
      Address,
      vehicleType,
      otherDetails,
      from,
    } = req.body;

    if (fileUrl) {
      req.body.bills = req.file.filename;
    }
    if (
      mongoose.Types.ObjectId.isValid(req.params.id) &&
      mongoose.Types.ObjectId.isValid(customer)
    ) {
      let objectId = new mongoose.Types.ObjectId(req.params.id);
      let userobjectId = new mongoose.Types.ObjectId(req.user.ID);
      let customerobjectId = new mongoose.Types.ObjectId(customer);

      let isExpenseExist = await expenses.findOne({
        _id: objectId,
        Deleted: false,
        Approval_HOD: false,
        Rejected_HOD: false,
        Approval_Manager: false,
        Rejected_Manager: false,
      });
      let isCustomerExist = await customers.findOne({
        _id: customerobjectId,
        Deleted: false,
        Activate: true,
      });
      let isUserExist = await users.findOne({
        _id: userobjectId,
        Deleted: false,
        Activate: true,
      });
      if (isExpenseExist && isUserExist && isCustomerExist) {
        await expenses
          .findOneAndUpdate(
            {
              _id: req.params.id,
              Expense_raiser: userobjectId,
            },
            {
              Customer: customerobjectId,
              Expense_raiser: userobjectId,
              Department: department,
              Expense_date: expense_date,
              Expense_type: expenseType,
              Location_from: from,
              Location_to: to,
              Amount: amount,
              Address: Address,
              Description: description,
              Vehicle: vehicleType,
              Otherinfo: otherDetails,
              Company_name: companyName,
              Bill_photo: req.body.bills,
            }
          )
          .then((re) => {
            return res
              .status(200)
              .json({ message: "bill updated successfully" });
          })
          .catch((err) => {
            return res.status(400).json({ message: "failed to update bill" });
          });
      } else {
        return res.status(400).json({
          message: "failed to update bill because user does not exist",
        });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Errror" });
  }
};

//fetch all bills for approval or Reject by Manager

const showallApprovalOfManager = async (req, res) => {
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
                Approval_Manager: false,
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
            Otherinfo: 1,
            Vehicle: 1,
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

const ApprovalOfManager = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectid = new mongoose.Types.ObjectId(req.params.id);
      let isBillExist = await expenses.findOne({
        _id: objectid,
        Approval_HOD: false,
        Approval_Manager: false,
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
              Approval_Manager: false,
              Rejected_HOD: false,
              Rejected_Manager: false,
              Deleted: false,
            },
            {
              Approval_Manager: true,
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

const GetAllApprovalOfManger = async (req, res) => {
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
                Approval_Manager: true,
                Rejected_Manager: false,
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
            Vehicle: 1,
            Otherinfo: 1,
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

const RejectOfManager = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectid = new mongoose.Types.ObjectId(req.params.id);
      let isBillExist = await expenses.findOne({
        _id: objectid,
        Approval_HOD: false,
        Approval_Manager: false,
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
              Approval_Manager: false,
              Rejected_HOD: false,
              Rejected_Manager: false,
              Deleted: false,
            },
            {
              Rejected_Manager: true,
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

const GetAllRejectedOfManger = async (req, res) => {
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
                Approval_Manager: false,
                Rejected_Manager: true,
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

const GetOfManager = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectid = new mongoose.Types.ObjectId(req.params.id);
      let isBillExist = await expenses.findOne({
        _id: objectid,
        Approval_HOD: false,
        Approval_Manager: false,
        Rejected_HOD: false,
        Rejected_Manager: false,
        Deleted: false,
      });
      if (isBillExist) {
        await expenses
          .findOne({
            _id: objectid,
            Approval_HOD: false,
            Approval_Manager: false,
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
  reg,
  GetAll,
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
  GetOfManager,
  GetAllRejectedOfManger,
};
