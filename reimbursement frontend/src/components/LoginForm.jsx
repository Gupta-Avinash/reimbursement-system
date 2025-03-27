import React from "react";
import { useState } from "react";
import backend_url from "../axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/LoginContext";

const LoginForm = () => {
  let location = useNavigate();
  const { login, logout } = useAuth();
  const [user, setuser] = useState({
    email: "",
    password: "",
  });

  function handellogin() {
    login();
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setuser({ ...user, [name]: value });
  }
  async function handlesubmit(e) {
    e.preventDefault();
    // console.warn(user);
    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("password", user.password);
    let data = Object.fromEntries(formData.entries());
    // console.warn(data);
    try {
      let response = await axios.post(
        `${backend_url}/users/login`,
        data
      );
      // console.warn(response.data);
      if (response.data.message === "login successfully") {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          localStorage.setItem("accessToken", response.data.token);
          login();
          location("/");
        }, 1000);
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          // logout();
          location("/login");
        }, 1000);
      }
    } catch (error) {
      setuser({ email: "", password: "" });
      // console.warn(error.response);
      toast.error(error.response.data.message || "Network issue", {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        location("/login");
      }, 1100);
    }
  }

  return (
    <div>
      <h1 className="text-center mt-5">Login form</h1>
      <div className="d-flex justify-content-center p-3">
        <form className="border border-dark p-5" onSubmit={handlesubmit}>
          <div className="mb-3 form-group row">
            <label className="col-sm-2 col-form-label">Email:</label>
            <input
              className="border border-dark form-control"
              type="email"
              name="email"
              placeholder="Enter Email ID"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 form-group row">
            <label className="col-sm-2 col-form-label">Password:</label>
            <input
              className="border border-dark form-control"
              type="Password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
            />
          </div>
          <div className="form-group row">
            <button className="btn btn-primary mb-3" onClick={handellogin}>
              submit
            </button>
            <button className="btn btn-secondary"> clear</button>
          </div>
        </form>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default LoginForm;
