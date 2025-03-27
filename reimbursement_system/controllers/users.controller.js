import bcrypt from "bcrypt";
import users from "../models/user.model.js";
import mongoose from "mongoose";
import { setuser } from "../helper/Jwt.handle.js";

//CRUD OPERATION
const Registration = async (req, res) => {
  const { name, email, organization, departement, roles, password, date } =
    req.body;

  try {
    let duplicateUser = await users.findOne({ Email: email });
    if (duplicateUser) {
      return res.status(200).json({
        message: "Email Id exist please register with different Email ID ",
      });
    } else {
      const saltround = 10;
      let cipherPassword = await bcrypt.hash(password, saltround);
      await users
        .create({
          Name: name,
          Email: email,
          Organization: organization,
          Department: departement,
          Roles: roles,
          Password: cipherPassword,
          Plainpassword: password,
          DateOfJoining: date,
        })
        .then((re) => {
          return res.status(200).json({ message: "registration successfull" });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(400)
            .json({ message: " failed to register user try it again" });
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetAll = async (req, res) => {
  try {
    await users
      .find({ Deleted: false })
      .then((re) => {
        return res.status(200).json({ message: re });
      })
      .catch((err) => {
        return res.status(400).json({ message: "failed to fetch data " });
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const DeleteSingleUser = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      let isUserExist = await users.findById({ _id: objectId });
      if (isUserExist) {
        await users
          .findByIdAndUpdate(
            {
              _id: objectId,
            },
            {
              Deleted: true,
              Activate: false,
            }
          )
          .then((re) => {
            return res
              .status(200)
              .json({ message: " user deleted successfully" });
          })
          .catch((err) => {
            return res.status(400).json({ message: "failed to delete user" });
          });
      } else {
        return res.status(400).json({ message: "User Does not exist" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const Get = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      let isUserExist = await users.findOne({
        _id: objectId,
        Deleted: false,
      });
      if (isUserExist) {
        await users
          .findById({ _id: objectId, Deleted: false })
          .then((re) => {
            return res.status(200).json({ message: re });
          })
          .catch((err) => {
            return res.status(400).json({ message: "failed to fetech user" });
          });
      } else {
        return res.status(400).json({ message: "User Does not exist" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req, res) => {
  const { name, email, organization, departement, roles, password, date, activate } =
    req.body;
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      let isUserExist = await users.findOne({
        _id: objectId,
        Deleted: false,
      });

      if (isUserExist) {
        const saltround = 10;
        let cipherPassword = await bcrypt.hash(password, saltround);
        await users
          .findOneAndUpdate(
            {
              _id: objectId
            },
            {
              Name: name,
              Email: email,
              Organization: organization,
              Department: departement,
              Roles: roles,
              Password: cipherPassword,
              Plainpassword: password,
              DateOfJoining: date,
              Activate: activate,
            }
          )
          .then((re) => {
            return res
              .status(200)
              .json({ message: "user data updated successfully" });
          })
          .catch((err) => {
            return res.status(400).json({
              message:
                "failed to updated user data || please used different Email ID",
            });
          });
      } else {
        return res.status(400).json({ message: "User does not exist" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let isUserExist = await users.findOne({
      Email: email,
      Deleted: false,
      Activate: true,
    });
    if (isUserExist) {
      bcrypt.compare(password, isUserExist["Password"], (err, result) => {
        if (err) {
          return res.status(400).json({ message: "login failed " });
        }
        if (result) {
          let token = setuser({ isUserExist });
          return res
            .status(200)
            .json({ message: "login successfully", token: token });
        } else {
          return res
            .status(200)
            .json({ message: "incorrect Email or password " });
        }
      });
    } else {
      return res.status(400).json({ message: "user not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Active and Inactive users lists
const GetAllActiveUser = async (req, res) => {
  try {
    await users
      .find({ Deleted: false, Activate: true })
      .then((re) => {
        return res.status(200).json({ message: re });
      })
      .catch((err) => {
        return res.status(400).json({ message: "failed to fetch data" });
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetAllInactiveUser = async (req, res) => {
  try {
    await users
      .find({ Deleted: false, Activate: false })
      .then((re) => {
        return res.status(200).json({ message: re });
      })
      .catch((err) => {
        return res.status(400).json({ message: "failed to fetch data" });
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  Registration,
  GetAll,
  DeleteSingleUser,
  Get,
  update,
  login,
  GetAllActiveUser,
  GetAllInactiveUser,
};
