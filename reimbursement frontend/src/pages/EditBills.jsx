import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import backend_url from "../axios";
import axios from "axios";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditBills = () => {
  const location = useNavigate();
  const { id } = useParams();
  const [customers, setCustomers] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [address, setaddress] = useState([""]);
  let safeID = id || "67a0a134845a5cb9e453f113";
  const [Imagurl, setImageurl] = useState(null);
  const [formData, setFormData] = useState({
    customer: "",
    department: "",
    expenseType: "",
    amount: "",
    Address: "",
    description: "",
    companyName: "",
    file: null,
    expense_date: "",
    from: "",
    to: "",
    vehicleType: "",
    otherDetails: "",
  });

  useEffect(() => {
    async function fetch(ID) {
      try {
        let token = localStorage.getItem("accessToken");
        let respone = await axios.get(
          `${backend_url}/expenses/Applicant/${ID}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        setImageurl(respone.data.message.Bill_photo);
        setFormData({
          ...formData,
          customer: respone.data.message.Customer || "",
          department: respone.data.message.Department || "",
          expenseType: respone.data.message.Expense_type || "",
          amount: respone.data.message.Amount || "",
          Address: respone.data.message.Address || "",
          description: respone.data.message.Description || "",
          companyName: respone.data.message.Company_name || "",
          file: respone.data.message.Bill_photo || null,
          expense_date: respone.data.message.Expense_date || "",
          from: respone.data.message.Location_from || "",
          to: respone.data.message.Location_to || "",
          vehicleType: respone.data.message.Vehicle || "",
          otherDetails: respone.data.message.Otherinfo || "",
        });
        // console.warn(formData);
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
    fetch(safeID);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => location("/login"), 1000);
        return;
      }

      try {
        const customersData = await axios.get(
          `${backend_url}/customer/showcustomer`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        const fetchedCustomers = customersData.data.message;
        setCustomers(fetchedCustomers);

        // Find and set addresses when customer is already selected
        const selectedCustomer = fetchedCustomers.find(
          (customer) => customer._id === formData.customer
        );

        if (selectedCustomer && selectedCustomer.Address) {
          try {
            const parsedAddresses = JSON.parse(selectedCustomer.Address);
            setaddress(parsedAddresses);
          } catch (parseError) {
            console.error("Error parsing addresses:", parseError);
            setaddress([]);
          }
        }
      } catch (error) {
        toast.error("Failed to fetch customers", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    };

    fetchData();
  }, [formData.customer]);

  useEffect(() => {
    if (formData.customer) {
      let selectedCustomer = customers.find(
        (customer) => customer._id === formData.customer
      );

      if (selectedCustomer && selectedCustomer.Address) {
        try {
          const parsedAddresses = JSON.parse(selectedCustomer.Address);
          setaddress(parsedAddresses);
        } catch (error) {
          // console.error("Error parsing addresses:", error);
          setaddress([]);
        }
      }
    }
  }, [customers]);

  useEffect(() => {
    const today = new Date();
    const lastFiveDays = new Date();
    lastFiveDays.setDate(today.getDate() - 5);

    setMaxDate(today.toISOString().split("T")[0]); // Today's date in YYYY-MM-DD
    setMinDate(lastFiveDays.toISOString().split("T")[0]); // Date 5 days ago
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "customer") {
      let selectedcustomer = customers.find(
        (customer) => customer._id === value
      );
      let addresses = JSON.parse(selectedcustomer.Address);
      setaddress(addresses);
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    Object.keys(formData).forEach((key) => {
      if (key === "file") {
        // console.warn(formData.file);
        formDataToSend.append("bills", formData.file);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    try {
      let response = await axios.patch(
        `${backend_url}/expenses/Applicant/${safeID}`,
        formDataToSend,
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
  };

  const clearform = () => {
    setFormData({
      customer: "",
      department: "",
      expenseType: "",
      amount: "",
      Address: "",
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
    <div>
      <Navbar />
      <div className="container my-3 mb-5">
        <h3 className="mb-4">Expense Form (Edit)</h3>
        <form
          onSubmit={handleSubmit}
          className="p-4 border rounded shadow bg-white"
        >
          {/* Customer Dropdown */}
          <div className="mb-3">
            <h6 htmlFor="customer" className="form-label">
              Customer
            </h6>
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

          {/* Address Dropdown */}
          <div className="mb-3">
            <h6 htmlFor="Address" className="form-label">
              Address
            </h6>
            <select
              id="Address"
              name="Address"
              className="form-select"
              value={formData.Address}
              onChange={handleChange}
            >
              <option value="">Select Address</option>
              {address.map((add, index) => (
                <option key={index} value={add}>
                  {add}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="mb-3">
            <h6 htmlFor="dateInput" className="form-label">
              Select a Date
            </h6>
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
            <h6 htmlFor="department" className="form-label">
              Department
            </h6>
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
            <h6 htmlFor="expenseType" className="form-label">
              Expense Type
            </h6>
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
              <h6 htmlFor="from" className="form-label">
                Mode of Travel
              </h6>
              <select
                id="vehicleType"
                name="vehicleType"
                className="form-select mb-3"
                value={formData.vehicleType}
                onChange={handleChange}
              >
                <option value="">Select vehicle Type</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Rickshaw">Rickshaw</option>
                <option value="Taxi">Taxi</option>
                <option value="Bike">Bike</option>
              </select>

              <h6 htmlFor="from" className="form-label">
                From
              </h6>
              <input
                type="text"
                id="from"
                name="from"
                className="form-control"
                placeholder="Enter starting location"
                value={formData.from}
                onChange={handleChange}
              />
              <h6 htmlFor="to" className="form-label mt-2">
                To
              </h6>
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
              <h6 htmlFor="otherDetails" className="form-label">
                Other Details
              </h6>
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
            <h6 htmlFor="amount" className="form-label">
              Amount
            </h6>
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
            <h6 htmlFor="description" className="form-label">
              Description
            </h6>
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
            <h6 htmlFor="companyName" className="form-label">
              Company Name
            </h6>
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
            <h6> Bill Photo Uploaded</h6>
            <picture>
              <source
                media="(max-width: 576px)"
                srcSet={`http://onlyairconditioners.in/api/Bills/${Imagurl}`}
              />
              <img
                src={`http://onlyairconditioners.in/api/Bills/${Imagurl}`}
                alt="Bill photo"
                className="img-fluid rounded border shadow-sm"
                style={{ maxWidth: "100%", maxHeight: "400px" }}
              />
            </picture>
          </div>
          <div className="mb-3">
            <h6 htmlFor="file" className="form-label">
              Bill Photo
            </h6>
            <input
              type="file"
              id="file"
              name="file"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary me-2">
            Submit
          </button>

          <button type="reset" className="btn btn-danger" onClick={clearform}>
            clear
          </button>
        </form>
        <ToastContainer></ToastContainer>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default EditBills;
