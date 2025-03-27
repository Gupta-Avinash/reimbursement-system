import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import backend_url from "../axios";
import axios from "axios";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const EditCustomer = () => {
  const { id } = useParams();
  const safeID = id || "67a0a134845a5cb9e453f113";

  const [altercustomer, setAlterCustomer] = useState({
    name: "",
    email: "",
    address: [""],
    date: "",
    active: null,
  });

  useEffect(() => {
    async function fetch(ID) {
      let token = localStorage.getItem("accessToken");
      let response = await axios.get(`${backend_url}/customer/${ID}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      let Addresses = JSON.parse(response.data.message.Address);
      setAlterCustomer({
        ...altercustomer,
        name: response.data.message.Name,
        email: response.data.message.Email,
        address: Addresses,
        date: response.data.message.Date,
        active: response.data.message.Activate,
      });
    }
    fetch(safeID);
  }, []);

  const handleOnChange = (e) => {
    const { name, value, type } = e.target;
    setAlterCustomer((prev) => ({
      ...prev,
      [name]: type === "radio" ? value === "true" : value, // Convert radio value to boolean
    }));
  };

  const handleAddressChange = (index, value) => {
    const newAddresses = [...altercustomer.address];
    newAddresses[index] = value;
    setAlterCustomer((prev) => ({
      ...prev,
      address: newAddresses
    }));
  };

  const addNewAddressField = () => {
    setAlterCustomer((prev) => ({
      ...prev,
      address: [...prev.address, ""]
    }));
  };

  const removeAddressField = (indexToRemove) => {
    // Only remove if there's more than one address field
    if (altercustomer.address.length > 1) {
      setAlterCustomer((prev) => ({
        ...prev,
        address: prev.address.filter((_, index) => index !== indexToRemove)
      }));
    }
  };




  async function handleSubmit(e) {
    e.preventDefault();
    let addresses = JSON.stringify(altercustomer.address)
    try {
      const formData = new FormData();
      formData.append("name", altercustomer.name);
      formData.append("email", altercustomer.email);
      formData.append("date", altercustomer.date);
      formData.append("address", addresses);
      formData.append("activate", altercustomer.active);
      const data = Object.fromEntries(formData.entries());
      let token = localStorage.getItem("accessToken");
      let response = await axios.patch(
        `${backend_url}/customer/${safeID}`,
        data,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
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

  const clearform = () => {
    setAlterCustomer({
      name: "",
      email: "",
      address: [""],
      date: "",
      active: null,
    });
  };

  return (
    <div>
      <Navbar></Navbar>

      <div className="container mt-3 mb-5">
        <h3 className="mb-4">Edit Customer</h3>
        <form
          className="p-4 border rounded shadow bg-white"
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Customer Name:
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Your Customer Name"
              value={altercustomer.name}
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Customer Email:
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter Your Customer Email"
              value={altercustomer.email}
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
              value={altercustomer.date}
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Status:</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="true"
                  name="active"
                  checked={altercustomer.active === true}
                  onChange={handleOnChange}
                />{" "}
                Active
              </label>
              <label className="ms-3">
                <input
                  type="radio"
                  value="false"
                  name="active"
                  checked={altercustomer.active === false}
                  onChange={handleOnChange}
                />{" "}
                Inactive
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Customer Address:
            </label>
            {
              altercustomer.address.map((address,index)=>(
                <div key={index} className="input-group mb-2">
                  <input
                  type="text"
                  className="form-control"
                  placeholder={`Enter Address ${index + 1}`}
                  value={address}
                  onChange={(e) => handleAddressChange(index, e.target.value)}
                />
                {altercustomer.address.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeAddressField(index)}
                  >
                    Remove
                  </button>
                )}

                </div>
              ))
            }
             <button
              type="button"
              className="btn btn-secondary"
              onClick={addNewAddressField}
            >
              Add Another Address
            </button>
          </div>
          <button type="submit" className="btn btn-primary me-2">
            Submit
          </button>

          <button type="reset" className="btn btn-danger" onClick={clearform}>
            Clear
          </button>
        </form>
      </div>

      <ToastContainer></ToastContainer>
    </div>
  );
};

export default EditCustomer;
