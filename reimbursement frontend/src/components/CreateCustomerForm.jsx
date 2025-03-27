import React, { useState, useEffect } from "react";
import axios from "axios";
import backend_url from "../axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export const CreateCustomerForm = () => {
  const location = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    addresses: [""], // Initialize with one empty address
    date: "",
  });

  useEffect(() => {
    let token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please login", {
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
    setCustomer({ ...customer, [name]: value });
  }

  function handleAddressChange(index, value) {
    const newAddresses = [...customer.addresses];
    newAddresses[index] = value;
    setCustomer({ ...customer, addresses: newAddresses });
  }

  function addNewAddressField() {
    setCustomer({
      ...customer,
      addresses: [...customer.addresses, ""]
    });
  }

  function removeAddressField(indexToRemove) {
    // Only remove if there's more than one address field
    if (customer.addresses.length > 1) {
      setCustomer({
        ...customer,
        addresses: customer.addresses.filter((_, index) => index !== indexToRemove)
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Filter out empty addresses
    let filteredAddresses = customer.addresses.filter(address => address.trim() !== "");
    filteredAddresses = JSON.stringify(filteredAddresses);
    try {
      let token = localStorage.getItem("accessToken");
      let response = await axios.post(`${backend_url}/customer/reg`, {
        ...customer,
        address: filteredAddresses
      }, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setCustomer({
      name: "",
      email: "",
      addresses: [""],
      date: "",
    });
  };

  return (
    <div className="container my-3 mb-5">
      <h2 className="mb-4">Create Customer</h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow bg-white"
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Customer Name:
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Enter Your Customer Name"
            value={customer.name}
            onChange={handleOnChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Customer Email:
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter Your Customer Email"
            value={customer.email}
            onChange={handleOnChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">
            Customer Addresses:
          </label>
          {customer.addresses.map((address, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder={`Enter Address ${index + 1}`}
                value={address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                required
              />
              {customer.addresses.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeAddressField(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addNewAddressField}
          >
            Add Another Address
          </button>
        </div>
        
        <div className="mb-3">
          <label htmlFor="dateInput" className="form-label">
            Select a Date
          </label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={customer.date}
            onChange={handleOnChange}
            required
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary me-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        
        <button 
          type="reset" 
          className="btn btn-danger" 
          onClick={clearForm}
        >
          Clear
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};