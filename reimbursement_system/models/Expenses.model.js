import mongoose from "mongoose";
import { Schema } from "mongoose";

const ExpensesSchema = new mongoose.Schema(
  {
    Customer: { type: Schema.Types.ObjectId, ref: "customers" },
    Expense_raiser: { type: Schema.Types.ObjectId, ref: "users" },
    Department: {
      type: String,
      enum: ["Installation", "Service", "Maintenance", "Sales"],
    },
    Expense_date: { type: String, require: true },
    Expense_type: { type: String, require: true },
    Location_from: { type: String, default: "N/A" },
    Address: { type: String, default: "N/A" },
    Location_to: { type: String, default: "N/A" },
    Otherinfo: { type: String, default: "N/A" },
    Amount: { type: String, default: "0" },
    Description: { type: String, default: "N/A" },
    Vehicle: { type: String, default: "N/A"},
    Company_name: { type: String },
    Approval_HOD: { type: Boolean, default: false },
    Rejected_HOD: { type: Boolean, default: false },
    Approval_Manager: { type: Boolean, default: false },
    Rejected_Manager: { type: Boolean, default: false },
    Bill_photo: { type: String, default: "N/A" },
    Deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const expenses = mongoose.model("expenses", ExpensesSchema);
export default expenses;
