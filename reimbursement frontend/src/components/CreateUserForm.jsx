import { useState, useEffect } from "react";
import React from "react";
import backend_url from "../axios";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const CreateUserForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useNavigate();
  const [user, setuser] = useState({
    name: "",
    email: "",
    organization: "",
    departement: "",
    roles: "",
    password: "",
    date: "",
  });

  useEffect(() => {
    let token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("please login", {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        return location("/login");
      }, 1000);
    }
  }, []);

  function handleOnChange(e) {
    const { name, value } = e.target;
    setuser({ ...user, [name]: value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("organization", user.organization);
    formData.append("departement", user.departement);
    formData.append("roles", user.roles);
    formData.append("password", user.password);
    formData.append("date", user.date);
    const data = Object.fromEntries(formData.entries());
    // console.warn(data);

    try {
      let token = localStorage.getItem("accessToken");
      let response = await axios.post(`${backend_url}/users/reg`, data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      // console.log(error);
      // console.warn(error.response.data.message || "data not submited");
      if (error.response.status == 400 || 500) {
        toast.error("data not submited" || error.response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } finally {
      setuser({
        name: "",
        email: "",
        organization: "",
        departement: "",
        roles: "",
        password: "",
        date: "",
      });
      setIsSubmitting(false);
    }
  }

  const clearform = () => {
    setuser({
      name: "",
      email: "",
      organization: "",
      departement: "",
      roles: "",
      password: "",
      date: "",
    });
  };
  return (
    <div className="container my-3 mb-5">
      <h2 className="mb-4">Create User</h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow bg-white"
      >
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            User Name:
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Enter Your Name"
            value={user.name}
            onChange={handleOnChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Email Id:
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter Your Email ID"
            value={user.email}
            onChange={handleOnChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="department" className="form-label">
            Organization
          </label>
          <select
            name="organization"
            className="form-select"
            value={user.organization}
            onChange={handleOnChange}
          >
            <option value="">Select Company</option>
            <option value="EC System">EC System</option>
            <option value="Only AirConditoners">Only AirConditoners</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="department" className="form-label">
            Department
          </label>
          <select
            name="departement"
            className="form-select"
            value={user.departement}
            onChange={handleOnChange}
          >
            <option value="">Select Department</option>
            <option value="Installation">Installation</option>
            <option value="Service">Service</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="department" className="form-label">
            Role:
          </label>
          <select
            name="roles"
            className="form-select"
            value={user.roles}
            onChange={handleOnChange}
          >
            <option value="">Select Role</option>
            <option value="Technician">Technician</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Executive">Executive</option>
            <option value="Director">Director</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Pasword:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            className="form-control"
            value={user.password}
            onChange={handleOnChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateInput" className="form-label">
            Select a Date
          </label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={user.date}
            onChange={handleOnChange}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary me-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <button type="reset" className="btn btn-danger" onClick={clearform}>
          Clear
        </button>
      </form>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default CreateUserForm;
