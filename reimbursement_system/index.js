import express from "express";
import routers from "./routers/index.js";
import "./helper/db.connection.js";
import "dotenv/config";
import cors from "cors";
import bcrypt from "bcrypt";
import users from "./models/user.model.js";
import mongoose from "mongoose";
const app = express();

// cors

app.use(
  cors({
    origin: "http://localhost:3303",    //http://onlyairconditioners.in
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3303"); // Allow all origins   http://onlyairconditioners.in
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

mongoose
  .connect("mongodb://localhost:27017/reimbursement") //mongodb+srv://arjunraut0725:mc1rg2SMBdbgtJuS@cluster0.pt6or.mongodb.net/reimbursement?retryWrites=true&w=majority&appName=Cluster0
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB");
  });

//input taker
app.use(express.json({ limit: "50mb" }));

//default user
try {
  async function createuser() {
    let isuserExit = await users.findOne();
    if (!isuserExit) {
      let saltround = 10;
      let cihperpassword = await bcrypt.hash("admin@123", saltround);
      await users
        .create({
          Name: "admin",
          Email: "admin@gmail.com",
          Organization: "Only AirConditoners",
          Department: "Installation",
          Roles: "Director",
          Password: cihperpassword,
          Plainpassword: "admin@123",
          DateOfJoining: "2025-02-01",
        })
        .then((re) => {
          console.log(re);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("user exist please login ");
    }
  }
  createuser();
} catch (error) {
  console.log(error);
}

//server side testing log
app.get("/", (req, res) => {
  res.json("Deployment successfull");
});

//main router
app.use("/api", routers);

//static folder
app.use(express.static("images"));

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});
