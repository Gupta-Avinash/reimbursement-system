import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import backend_url from "../axios";
import axios from "axios";
import { useHOD } from "../context/HODApprovalContex";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import AlertImagePopup from "../components/AlertImagePopup";

const ReimburementPhaseSecond2 = () => {
  const location = useNavigate();
  // const [bills, setbills] = useState([]);
  const { bills, setbills, approvedbills, rejectedbills } = useHOD();
  useEffect(() => {
    const fetch = async () => {
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

      try {
        let reponse = await axios.get(
          `${backend_url}/expenses/Applicant/bills/final`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setbills(reponse.data.message);
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
    fetch();
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
      // console.warn(response.data.message);
      approvedbills(ID);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
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
        return location("/login");
      }
      let response = await axios.delete(
        `${backend_url}/expenses/Applicant/bills/final/${ID}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      rejectedbills(ID);
      toast.error(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
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
        <h1>Bill Approved by HOD</h1>
        <button
          className="btn btn-success me-2"
          onClick={() => {
            location("/Reimbursement/phase2/Approved");
          }}
        >
          Approved
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            location("/Reimbursement/phase2/Rejected");
          }}
        >
          Rejected
        </button>
        {bills && bills.length > 0 ? (
          <div style={{ overflowX: "auto", width: "100%", paddingTop: "1rem" }}>
            <table
              border="1"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    {" "}
                    Sr no
                  </th>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    Expense Raiser Name
                  </th>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    Address
                  </th>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    Expense Raiser Email-ID
                  </th>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    Organization
                  </th>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    Expense Date
                  </th>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    Expense Type
                  </th>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    {" "}
                    from{" "}
                  </th>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    {" "}
                    to{" "}
                  </th>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    Bill photo
                  </th>
                  <th
                    style={{
                      border: "1px solid #333",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, index) => (
                  <tr key={bill._id}>
                    <td
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      {bill.user[0].Name}
                    </td>
                    <td
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      {bill.Address}
                    </td>
                    <td
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      {bill.user[0].Email}
                    </td>
                    <td
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      {bill.Company_name}
                    </td>
                    <td
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      {bill.Expense_date}
                    </td>
                    <td
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      {bill.Expense_type} | {bill.Vehicle} | {bill.Otherinfo}
                    </td>
                    <td
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      {bill.Location_from}
                    </td>
                    <td
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      {bill.Location_to}
                    </td>
                    <td
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      {bill.Description}
                    </td>
                    <td
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      {bill.Amount}
                    </td>
                    <td
                      style={{
                        width: "100px",
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      <AlertImagePopup
                        src={`http://onlyairconditioners.in/api/Bills/${bill.Bill_photo}`}
                        alt={"bill Image"}
                      />
                    </td>
                    <td
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      <div className="d-flex flex-column flex-sm-row gap-2">
                        <button
                          className="btn btn-primary w-100 w-sm-auto"
                          onClick={() => {
                            location(`/Reimbursement/phase2/view/${bill._id}`);
                          }}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-success w-100 w-sm-auto"
                          onClick={() => {
                            handleApproval(bill._id);
                          }}
                        >
                          Approved
                        </button>
                        <button
                          className="btn btn-danger w-100 w-sm-auto"
                          onClick={() => {
                            handleReject(bill._id);
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h1>No Bills founds</h1>
        )}
      </div>

      <ToastContainer></ToastContainer>
    </div>
  );
};

export default ReimburementPhaseSecond2;
