import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useAuth } from "../context/LoginContext";
import companylog from "../../public/company_logo.jpeg";

const Navbar = () => {
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  const handlogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src={companylog}
            alt="logo"
            height="40"
            className="d-inline-block align-top"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/Dashboard" ? "active" : ""
                }`}
                to="/Dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/Create/ExpenseBill" ? "active" : ""
                }`}
                to="/Create/ExpenseBill"
              >
                Create Claims
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link ${
                  location.pathname === "/Create/User" ? "active" : ""
                }`}
                to="/Create/User"
              >
                Create User
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link ${
                  location.pathname === "/Create/Customer" ? "active" : ""
                }`}
                to="/Create/Customer"
              >
                Create Customer
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link ${
                  location.pathname === "/Show/ExpenseBill" ? "active" : ""
                }`}
                to="/Show/ExpenseBill"
              >
                Show Claims
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link ${
                  location.pathname === "/Show/Customer" ? "active" : ""
                }`}
                to="/Show/Customer"
              >
                Show Customers
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link ${
                  location.pathname === "/Show/User" ? "active" : ""
                }`}
                to="/Show/User"
              >
                Show Users
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link ${
                  location.pathname === "/Reimbursement" ||
                  location.pathname === "/Reimbursement/Approved" ||
                  location.pathname === "/Reimbursement/Rejected"
                    ? "active"
                    : ""
                }`}
                to="/Reimbursement"
              >
                Bills Approval Supervisor
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link ${
                  location.pathname === "/Reimbursement/phase2" ||
                  location.pathname === "/Reimbursement/phase2/Approved" ||
                  location.pathname === "/Reimbursement/phase2/Rejected"
                    ? "active"
                    : ""
                }`}
                to="/Reimbursement/phase2"
              >
                Bills Approval Executive
              </Link>
            </li>

            {isLoggedIn ? (
              <li className="nav-item">
                <Link
                  to="/login"
                  className="btn btn-outline-light ms-2"
                  onClick={handlogout}
                >
                  Logout
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/login" ? "active" : ""
                  }`}
                  to="/login"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
