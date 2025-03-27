import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import backend_url from "../axios";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";

const ViewBillByManager = () => {
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
          `${backend_url}/expenses/Applicant/bills/${ID}`,
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
        `${backend_url}/expenses/Applicant/bills/${ID}`,
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
        location("/Reimbursement/Approved");
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
        `${backend_url}/expenses/Applicant/bills/${ID}`,
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
        location("/Reimbursement/Rejected");
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
    <>
      <Navbar></Navbar>

      <div className="container my-3 mb-5">
        {Bill ? (
          <div className="container-fluid p-0">
            <div className="card shadow rounded-3 mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Expense Reimbursement Details</h4>
              </div>
              <div className="card-body p-3">
                <div className="row g-3">
                  <div className="col-md-6">
                    <p className="card-text mb-2">
                      <strong>Name:</strong> {Bill?.Expense_raiser?.Name}
                    </p>
                    <p className="card-text mb-2">
                      <strong>Email:</strong> {Bill?.Expense_raiser?.Email}
                    </p>
                    <p className="card-text mb-2">
                      <strong>Customer Address:</strong> {Bill?.Address}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="card-text mb-2">
                      <strong>Company:</strong> {Bill?.Company_name}
                    </p>
                    <p className="card-text mb-2">
                      <strong>Reimbursement Amount:</strong> {Bill?.Amount} Rs.
                    </p>
                  </div>
                </div>

                <div className="my-3" />

                <div className="card-text bg-light p-3 rounded mb-3">
                  {Bill?.Expense_type === "Travel" ? (
                    <div className="row g-2">
                      <div className="col-md-3">
                        <p className="card-text mb-2">
                          <strong>Type:</strong> {Bill?.Expense_type}
                        </p>
                      </div>
                      <div className="col-md-3">
                        <p className="card-text mb-2">
                          <strong>Vehicle:</strong> {Bill?.Vehicle}
                        </p>
                      </div>
                      <div className="col-md-3">
                        <p className="card-text mb-2">
                          <strong>From:</strong> {Bill?.Location_from}
                        </p>
                      </div>
                      <div className="col-md-3">
                        <p className="card-text mb-2">
                          <strong>To:</strong> {Bill?.Location_to}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="card-text mb-0">
                      <strong>Info of other expense:</strong> {Bill?.Otherinfo}
                    </p>
                  )}
                </div>

                <div className="card-text mb-3">
                  <strong>Description:</strong>
                  <p className="mt-1 mb-0">{Bill?.Description}</p>
                </div>

                <div className="card-text mb-3">
                  <strong>Bill Photo:</strong>
                  <div className="mt-2 text-center">
                    <picture>
                      <source
                        media="(max-width: 600px)"
                        srcSet={`http://onlyairconditioners.in/api/Bills/${Bill?.Bill_photo}`}
                      />
                      <img
                        src={`http://onlyairconditioners.in/api/Bills/${Bill?.Bill_photo}`}
                        alt="Bill photo"
                        className="img-fluid rounded border"
                        style={{ maxWidth: "100%", maxHeight: "400px" }}
                      />
                    </picture>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      handleApproval(Bill._id);
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleReject(Bill._id);
                    }}
                  >
                    Reject
                  </button>
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
    </>
  );
};

export default ViewBillByManager;
