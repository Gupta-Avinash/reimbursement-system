import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    Name: { type: String, require: true },
    Email: { type: String, require: true },
    Organization: { type: String, enum: ["EC System", "Only AirConditoners"] },
    Department: {
      type: String,
      enum: ["Installation", "Service", "Maintenance", "Sales"],
    },
    Roles: {
      type: String,
      enum: ["Technician", "Supervisor", "Executive", "Director"],
    },
    Password: { type: String, require: true },
    Plainpassword: { type: String, require: true },
    Activate: { type: Boolean, default: true },
    DateOfJoining: { type: String, required: true },
    Deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const users = mongoose.model("users", UserSchema);
export default users;
