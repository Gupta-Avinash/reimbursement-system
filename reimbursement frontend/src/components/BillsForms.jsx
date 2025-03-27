import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import backend_url from "../axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const BillsForms = () => {
  let location = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [address,setaddress] = useState([""])

  // State for form inputs
  const [formData, setFormData] = useState({
    customer: "",
    department: "",
    Address:"",
    expenseType: "",
    amount: "",
    description: "",
    companyName: "",
    file: null,
    expense_date: "",
    from: "",
    to: "",
    vehicleType: "",
    otherDetails: "",
  });
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  useEffect(() => {
    const today = new Date();
    const lastFiveDays = new Date();
    lastFiveDays.setDate(today.getDate() - 2);

    setMaxDate(today.toISOString().split("T")[0]); // Today's date in YYYY-MM-DD
    setMinDate(lastFiveDays.toISOString().split("T")[0]); // Date 5 days ago
  }, []);

  // Fetch dropdown data from backend
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
    const fetchData = async () => {
      const customersData = await axios.get(`${backend_url}/customer/showall`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      // console.log(customersData.data.message);
      setCustomers(customersData.data.message);
    };

    fetchData();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "customer")
    {
      let selectedcustomer = customers.find(customer =>customer._id === value)
      let addresses = JSON.parse(selectedcustomer.Address);
      setaddress(addresses);
      setFormData({ ...formData, [name]: value });
    }else{
      setFormData({ ...formData, [name]: value });
    }
    
    
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const formDataToSend = new FormData();
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

    // formDataToSend.append("customer", formData.customer);

    Object.keys(formData).forEach((key) => {
      if (key === "file") {
        formDataToSend.append("bills", formData.file);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      let response = await axios.post(
        `${backend_url}/expenses/reg`,
        formDataToSend,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
      setFormData({
        customer: "",
        department: "",
        expenseType: "",
        Address:"",
        amount: "",
        description: "",
        companyName: "",
        file: null,
        expense_date: "",
        from: "",
        to: "",
        vehicleType: "",
        otherDetails: "",
      });

      // Reset file input
      document.getElementById("file").value = "";
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearform = () => {
    setFormData({
      customer: "",
      department: "",
      expenseType: "",
      Address:"",
      amount: "",
      description: "",
      companyName: "",
      file: null,
      expense_date: "",
      from: "",
      to: "",
      vehicleType: "",
      otherDetails: "",
    });
  };

  return (
    <div className="container my-3 mb-5">
      <h2 className="mb-4">Expense Form</h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow bg-white"
      >
        {/* Customer Dropdown */}
        <div className="mb-3">
          <label htmlFor="customer" className="form-label">
            Customer
          </label>
          <select
            id="customer"
            name="customer"
            className="form-select"
            value={formData.customer}
            onChange={handleChange}
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="Address" className="form-label">
            Address
          </label>
          <select
            id="Address"
            name="Address"
            className="form-select"
            value={formData.Address}
            onChange={handleChange}
          >
            <option value="">Select Customer</option>
              {address.map((add,index) => (
                <option key={index} value={add}>
                  {add}
                </option>
              ))}
            
          </select>
          
        </div>
        <div>
          <label htmlFor="dateInput" className="form-label">
            Select a Date
          </label>
          <input
            type="date"
            className="form-control"
            name="expense_date"
            value={formData.expense_date}
            onChange={handleChange}
            min={minDate}
            max={maxDate}
          />
        </div>

        {/* Department Dropdown */}
        <div className="mb-3">
          <label htmlFor="department" className="form-label">
            Department
          </label>
          <select
            id="department"
            name="department"
            className="form-select"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="Installation">Installation</option>
            <option value="Service">Service</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        {/* Expense Type Dropdown */}
        <div className="mb-3">
          <label htmlFor="expenseType" className="form-label">
            Expense Type
          </label>
          <select
            id="expenseType"
            name="expenseType"
            className="form-select"
            value={formData.expenseType}
            onChange={handleChange}
          >
            <option value="">Select Expense Type</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Petrol">Petrol</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Conditionally Rendered Fields */}
        {formData.expenseType === "Travel" && (
          <div className="mb-3">
            <label htmlFor="from" className="form-label">
              Mode of Travel
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              className="form-select"
              value={formData.vehicleType}
              onChange={handleChange}
            >
              <option value="">Select vehicle Type</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Rickshaw">Rickshaw</option>
              <option value="Taxi">Taxi</option>
              <option value="Bike">Bike</option>
              <option value="TEMPO">Tempo</option>
            </select>

            <label htmlFor="from" className="form-label">
              From
            </label>
            <input
              type="text"
              id="from"
              name="from"
              className="form-control"
              placeholder="Enter starting location"
              value={formData.from}
              onChange={handleChange}
            />
            <label htmlFor="to" className="form-label mt-2">
              To
            </label>
            <input
              type="text"
              id="to"
              name="to"
              className="form-control"
              placeholder="Enter destination"
              value={formData.to}
              onChange={handleChange}
            />
          </div>
        )}

        {formData.expenseType === "Others" && (
          <div className="mb-3">
            <label htmlFor="otherDetails" className="form-label">
              Other Details
            </label>
            <textarea
              id="otherDetails"
              name="otherDetails"
              className="form-control"
              placeholder="Provide additional details"
              value={formData.otherDetails}
              onChange={handleChange}
            ></textarea>
          </div>
        )}

        {/* Amount Input */}
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            className="form-control"
            placeholder="Enter Amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        {/* Description Input */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Company Name Dropdown */}
        <div className="mb-3">
          <label htmlFor="companyName" className="form-label">
            Company Name
          </label>
          <select
            id="companyName"
            name="companyName"
            className="form-select"
            value={formData.companyName}
            onChange={handleChange}
          >
            <option value="">Select Company</option>
            <option value="EC System">EC System</option>
            <option value="Only AirConditoners">Only AirConditoners</option>
          </select>
        </div>

        {/* File Upload */}
        <div className="mb-3">
          <label htmlFor="file" className="form-label">
            Upload File
          </label>
          <input
            type="file"
            id="file"
            name="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {/* Submit Button */}
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

export default BillsForms;
