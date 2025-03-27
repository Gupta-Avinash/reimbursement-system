import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import backend_url from "../axios";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";

const ViewBillByHOD = () => {
  const location = useNavigate();
  const { id } = useParams();
  const [Bill, setBill] = useState({});

  useEffect(() => {
    let token = localStorage.getItem("accessToken");
    if (!token) {
      return location("/login");
    }
    async function fetch(ID) {
      try {
        let response = await axios.get(
          `${backend_url}/expenses/Applicant/bills/final/${ID}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        // console.warn(response.data.message);
        setBill(response.data.message);
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
    fetch(id);
  }, []);

  const handleApproval = async (ID) => {
    try {
      let token = localStorage.getItem("accessToken");
      if (!token) {
        return location("/login");
      }
      let response = await axios.patch(
        `${backend_url}/expenses/Applicant/bills/final/${ID}`,
        {},
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
      setTimeout(() => {
        location("/Reimbursement/phase2/Approved");
      }, 1000);
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

  const handleReject = async (ID) => {
    try {
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
      let response = await axios.delete(
        `${backend_url}/expenses/Applicant/bills/final/${ID}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      toast.error(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        location("/Reimbursement/phase2/Rejected");
      }, 1000);
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

  return (
    <div>
      <Navbar></Navbar>
      <div className="container my-3 mb-5">
        {Bill ? (
          <div className="container-fluid p-0">
            <div className="card shadow rounded-3 mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Expense Reimbursement Request</h4>
              </div>
              <div className="card-body p-4">
                {/* Requester Information */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <span className="fw-bold">Name:</span>{" "}
                      {Bill?.Expense_raiser?.Name}
                    </p>
                    <p className="mb-2">
                      <span className="fw-bold">Email:</span>{" "}
                      {Bill?.Expense_raiser?.Email}
                    </p>
                    <p className="mb-2">
                      <span className="fw-bold">Customer Address:</span>{" "}
                      {Bill?.Address}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <span className="fw-bold">Company:</span>{" "}
                      {Bill?.Company_name}
                    </p>
                    <p className="mb-2">
                      <span className="fw-bold">Reimbursement Amount:</span> $
                      {Bill?.Amount}
                    </p>
                  </div>
                </div>

                {/* Expense Details */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card bg-light">
                      <div className="card-body">
                        {Bill?.Expense_type === "Travel" ? (
                          <div className="row">
                            <div className="col-md-3 mb-2">
                              <span className="fw-bold">Type:</span>{" "}
                              {Bill?.Expense_type}
                            </div>
                            <div className="col-md-3 mb-2">
                              <span className="fw-bold">Vehicle:</span>{" "}
                              {Bill?.Vehicle}
                            </div>
                            <div className="col-md-3 mb-2">
                              <span className="fw-bold">From:</span>{" "}
                              {Bill?.Location_from}
                            </div>
                            <div className="col-md-3 mb-2">
                              <span className="fw-bold">To:</span>{" "}
                              {Bill?.Location_to}
                            </div>
                          </div>
                        ) : (
                          <div className="row">
                            <div className="col-12 mb-2">
                              <span className="fw-bold">
                                Info of other expense:
                              </span>{" "}
                              {Bill?.Otherinfo}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="p-3 border rounded">
                      <span className="fw-bold">Description:</span>
                      <p className="mt-2">{Bill?.Description}</p>
                    </div>
                  </div>
                </div>

                {/* Bill Photo */}
                <div className="row mb-4">
                  <div className="col-12">
                    <span className="fw-bold d-block mb-2">Bill Photo:</span>
                    <div className="text-center">
                      <picture>
                        <source
                          media="(max-width: 576px)"
                          srcSet={`http://onlyairconditioners.in/api/Bills/${Bill?.Bill_photo}`}
                        />
                        <img
                          src={`http://onlyairconditioners.in/api/Bills/${Bill?.Bill_photo}`}
                          alt="Bill photo"
                          className="img-fluid rounded border shadow-sm"
                          style={{ maxWidth: "100%", maxHeight: "400px" }}
                        />
                      </picture>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-success px-4"
                        onClick={() => handleApproval(Bill._id)}
                      >
                        <i className="bi bi-check-circle me-2"></i>Approve
                      </button>
                      <button
                        className="btn btn-danger px-4"
                        onClick={() => handleReject(Bill._id)}
                      >
                        <i className="bi bi-x-circle me-2"></i>Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default ViewBillByHOD;
