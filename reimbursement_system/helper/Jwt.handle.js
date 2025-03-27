import jwt from "jsonwebtoken";
import "dotenv/config";

const setuser = (a) => {
  let userJWT = {};
  userJWT.name = a.isUserExist.Name;
  userJWT.ID = a.isUserExist._id;
  userJWT.email = a.isUserExist.Email;
  userJWT.role = a.isUserExist.Roles;
  userJWT.department = a.isUserExist.Department;
  userJWT.org = a.isUserExist.Organization;
  return jwt.sign(userJWT, process.env.SECRET, { expiresIn: "9h" });
};

function loginChecker_verifyuser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided please login" });
  }
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token please login" });
    }

    req.user = user;
    next();
  });
}

function restrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(400).json({ message: "Invalid token please login" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({ message: "UnAuthorized access" });
    }
    next();
  };
}

export { setuser, loginChecker_verifyuser, restrictTo };
