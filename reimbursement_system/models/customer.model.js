import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    Name: { type: String, require: true },
    Email: { type: String, require: true },
    Address: { type: String, require: true },
    Activate: { type: Boolean, default: true },
    Date: { type: String, required: true },
    Deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const customers = mongoose.model("customers", CustomerSchema);
export default customers;
