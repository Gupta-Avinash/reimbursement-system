import customers from "../models/customer.model.js";
import mongoose from "mongoose";

//CRUD Operation
const Register = async (req, res) => {
  console.log(req.body)
  const { name, email, address, date } = req.body;
  try {
    let duplicateCustomer = await customers.findOne({ Email: email });
    if (duplicateCustomer) {
      return res.status(200).json({
        message:
          "Email ID already Exist please register with different Email ID",
      });
    } else {
      await customers
        .create({
          Name: name,
          Email: email,
          Address: address,
          Date: date,
        })
        .then((re) => {
          return res
            .status(200)
            .json({ message: "customer register successful" });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ message: " failed to register user try it again" });
        });
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

const GetAll = async (req, res) => {
  try {
    await customers
      .find({ Deleted: false })
      .then((re) => {
        return res.status(200).json({ message: re });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ message: "failed to fetch customer data" });
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const Get = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectId = new mongoose.Types.ObjectId(req.params.id);
      let isCustomerExist = await customers.findOne({
        _id: objectId,
        Deleted: false,
      });
      if (isCustomerExist) {
        return res.status(200).json({ message: isCustomerExist });
      } else {
        return res.status(400).json({ message: "Customer not found" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const { name, email, address, date, activate } = req.body;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectid = new mongoose.Types.ObjectId(req.params.id);
      let isCustomerExist = await customers.findOne({
        _id: objectid,
        Deleted: false,
      });
      if (isCustomerExist) {
        await customers
          .findByIdAndUpdate(
            {
              _id: req.params.id,
            },
            {
              Name: name,
              Email: email,
              Address: address,
              Date: date,
              Activate: activate,
            }
          )
          .then((re) => {
            return res
              .status(200)
              .json({ message: "Customer data updated successfully" });
          })
          .catch((err) => {
            return res
              .status(400)
              .json({ message: "failed to update user data" });
          });
      } else {
        return res.status(400).json({ message: "Customer not found" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON Id" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const DeletedSigleCustomer = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      let objectId = new mongoose.Types.ObjectId(req.params.id);
      let isCustomerExist = await customers.findOne({ _id: objectId });
      if (isCustomerExist) {
        await customers
          .findByIdAndUpdate(
            {
              _id: req.params.id,
            },
            {
              Deleted: true,
              Activate: false,
            }
          )
          .then((re) => {
            return res
              .status(200)
              .json({ message: "customer Deleted successful" });
          })
          .catch((err) => {
            return res
              .status(400)
              .json({ message: "failed to delete customer" });
          });
      } else {
        return res.status(400).json({ message: "customer does not exist" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server erro" });
  }
};

export { Register, GetAll, Get, update, DeletedSigleCustomer };
