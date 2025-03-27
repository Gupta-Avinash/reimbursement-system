import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import backend_url from "../axios";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import AlertImagePopup from "../components/AlertImagePopup";

const ApprovedByManager = () => {
  const location = useNavigate();
  const [bills, setbills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);

  useEffect(() => {
    async function fetch() {
      try {
        let token = localStorage.getItem("accessToken");
        if (!token) {
          return location("/login");
        }
        let response = await axios.get(
          `${backend_url}/expenses/Applicant/bills/Approved`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        // console.warn(response.data.message);
        setbills(response.data.message);
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
    fetch();
  }, []);

  // Logic for pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = bills.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(bills.length / entriesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <Navbar></Navbar>

      <div className="container my-3 mb-5">
        <h1>Approved Bills</h1>
        <button
          className="btn btn-success me-2"
          onClick={() => {
            location("/Reimbursement/Approved");
          }}
        >
          Approved
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            location("/Reimbursement/Rejected");
          }}
        >
          Rejected
        </button>
        {bills && bills.length > 0 ? (
          <>
            <div
              style={{ overflowX: "auto", width: "100%", paddingTop: "1rem" }}
            >
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
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
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((bill, index) => (
                    <tr key={bill._id}>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {indexOfFirstEntry + index + 1}
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
                          width: "100%",
                          height: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #333",
                          padding: "8px",
                        }}
                      >
                        <AlertImagePopup
                          src={`http://onlyairconditioners.in/api/Bills/${bill.Bill_photo}`}
                          alt={"bill Image"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-container mt-4 d-flex justify-content-center">
              <div>
                <nav>
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button className="page-link" onClick={prevPage}>
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button className="page-link" onClick={nextPage}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="text-center mt-2">
              Showing {indexOfFirstEntry + 1} to{" "}
              {Math.min(indexOfLastEntry, bills.length)} of {bills.length}{" "}
              entries
            </div>
          </>
        ) : (
          <h1>No Approved Bills founds</h1>
        )}
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default ApprovedByManager;
