import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import backend_url from "../axios";
import axios from "axios";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const EditUserPage = () => {
  let { id } = useParams();
  const safeID = id || "67a0a134845a5cb9e453f113";

  function handleOnChange(e) {
    const { name, value, type } = e.target;
    setAlterUser((prev) => ({
      ...prev,
      [name]: type === "radio" ? value === "true" : value, // Convert radio value to boolean
    }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", alteruser.name);
    formData.append("email", alteruser.email);
    formData.append("organization", alteruser.organization);
    formData.append("departement", alteruser.departement);
    formData.append("roles", alteruser.roles);
    formData.append("password", alteruser.password);
    formData.append("date", alteruser.date);
    formData.append("activate", alteruser.active);
    const data = Object.fromEntries(formData.entries());
    try {
      let token = localStorage.getItem("accessToken");
      // console.log(data);
      let response = await axios.patch(`${backend_url}/users/${safeID}`, data, {
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
      if (axios.isAxiosError) {
        toast.error(error?.response?.data?.message, {
          position: "top-right",
          autoClose: 1000,
        });
      } else {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    }
  }

  const [alteruser, setAlterUser] = useState({
    name: "",
    email: "",
    organization: "",
    departement: "",
    roles: "",
    password: "",
    date: "",
    active: null,
  });

  useEffect(() => {
    try {
      let token = localStorage.getItem("accessToken");
      async function fetch(ID) {
        let response = await axios.get(`${backend_url}/users/${ID}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setAlterUser({
          ...alteruser,
          name: response.data.message.Name,
          email: response.data.message.Email,
          organization: response.data.message.Organization,
          departement: response.data.message.Department,
          roles: response.data.message.Roles,
          password: response.data.message.Plainpassword,
          date: response.data.message.DateOfJoining,
          active: response.data.message.Activate,
        });
      }

      fetch(safeID);
    } catch (error) {
      if (axios.isAxiosError) {
        toast.error(error?.response?.data?.message, {
          position: "top-right",
          autoClose: 1000,
        });
      } else {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    }
  }, []);

  const clearform = () => {
    setAlterUser({
      name: "",
      email: "",
      organization: "",
      departement: "",
      roles: "",
      password: "",
      date: "",
      active: null,
    });
  };

  return (
    <div>
      <Navbar></Navbar>

      <div className="container mt-3 mb-5">
        <h3 className="mb-4">Edit User</h3>
        <form
          className="p-4 border rounded shadow bg-white"
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              UserName:
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Your Name"
              value={alteruser.name}
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
              value={alteruser.email}
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
              value={alteruser.organization}
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
              value={alteruser.departement}
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
            <label className="form-label">Status:</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="true"
                  name="active"
                  checked={alteruser.active === true}
                  onChange={handleOnChange}
                />{" "}
                Active
              </label>
              <label className="ms-3">
                <input
                  type="radio"
                  value="false"
                  name="active"
                  checked={alteruser.active === false}
                  onChange={handleOnChange}
                />{" "}
                Inactive
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="department" className="form-label">
              Role:
            </label>
            <select
              name="roles"
              className="form-select"
              value={alteruser.roles}
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
              value={alteruser.password}
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
              value={alteruser.date}
              onChange={handleOnChange}
            />
          </div>
          <button type="submit" className="btn btn-primary me-2">
            Submit
          </button>

          <button type="reset" className="btn btn-danger " onClick={clearform}>
            clear
          </button>
        </form>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default EditUserPage;
