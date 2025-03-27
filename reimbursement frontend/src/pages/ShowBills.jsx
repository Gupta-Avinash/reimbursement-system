import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import axios from "axios";
import backend_url from "../axios";
import { useNavigate } from "react-router-dom";
import { useBills } from "../context/BillsContext";
import "react-toastify/dist/ReactToastify.css";
import AlertImagePopup from "../components/AlertImagePopup";
import { toast, ToastContainer } from "react-toastify";

export const ShowBills = () => {
  const location = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage] = useState(10);
  const { bills, setBills, deleteBill } = useBills();

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
      let reponse = await axios.get(`${backend_url}/expenses/`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setBills(reponse.data.message);
    };
    fetch();
  }, []);

  const handleDelete = async (ID) => {
    try {
      let token = localStorage.getItem("accessToken");
      if (!token) {
        setTimeout(() => {
          return location("/login");
        }, 1000);
        toast.error("Please login", {
          position: "top-right",
          autoClose: 1000,
        });
      }
      let response = await axios.delete(
        `${backend_url}/expenses/Applicant/${ID}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      deleteBill(ID);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  // Get current bills
  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Next page
  const nextPage = () => {
    if (currentPage < Math.ceil(bills.length / billsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="container my-3 mb-5">
        {bills && bills.length > 0 ? (
          <>
            <div
              style={{ overflowX: "auto", width: "100%", paddingTop: "1rem" }}
            >
              <table
                style={{
                  border: "1",
                  borderCollapse: "collapse",
                  width: "100%",
                  minWidth: "800px",
                }}
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
                      Sr no
                    </th>
                    <th
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "10px",
                      }}
                    >
                      Customer Name
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
                      Expense Raiser Name
                    </th>
                    <th
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "10px",
                      }}
                    >
                      Department
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
                      From
                    </th>
                    <th
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "10px",
                      }}
                    >
                      To
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
                  {currentBills.map((bill, index) => (
                    <tr key={bill._id} style={{ border: "1px solid #333" }}>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {indexOfFirstBill + index + 1}
                      </td>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {bill.Customer.Name}
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
                        {bill.Expense_raiser.Name}
                      </td>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {bill.Department}
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
                      <td>
                        <div
                          style={{
                            width: "100%",
                            height: "100px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #333",
                            padding: "10px",
                          }}
                        >
                          <AlertImagePopup
                            src={`http://onlyairconditioners.in/api/Bills/${bill.Bill_photo}`}
                            alt={"bill image"}
                          />
                        </div>
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
                              location(`/Edit/ExpenseBill/${bill._id}`);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger w-100 w-sm-auto"
                            onClick={() => {
                              handleDelete(bill._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination UI */}
            <div className="pagination-container mt-4 d-flex justify-content-center">
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    onClick={prevPage}
                    className="page-link"
                    aria-label="Previous"
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </button>
                </li>
                {Array.from(
                  { length: Math.ceil(bills.length / billsPerPage) },
                  (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        onClick={() => paginate(i + 1)}
                        className="page-link"
                      >
                        {i + 1}
                      </button>
                    </li>
                  )
                )}
                <li
                  className={`page-item ${
                    currentPage === Math.ceil(bills.length / billsPerPage)
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    onClick={nextPage}
                    className="page-link"
                    aria-label="Next"
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="text-center mt-2">
              <p>
                Showing {indexOfFirstBill + 1} to{" "}
                {Math.min(indexOfLastBill, bills.length)} of {bills.length}{" "}
                entries
              </p>
            </div>
          </>
        ) : (
          <h1>No Bills founds</h1>
        )}
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
};
