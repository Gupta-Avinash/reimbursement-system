import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import backend_url from "../axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import AlertImagePopup from "../components/AlertImagePopup";

const RejectedByHOD = () => {
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
          `${backend_url}/expenses/Applicant/bills/final/Rejected`,
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

  // Get current entries
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = bills.slice(indexOfFirstEntry, indexOfLastEntry);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(bills.length / entriesPerPage);

  return (
    <div>
      <Navbar></Navbar>
      <div className="container my-3 mb-5">
        <h1>No Rejected bills found</h1>
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

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>

                  {[...Array(totalPages).keys()].map((number) => (
                    <li
                      key={number + 1}
                      className={`page-item ${
                        currentPage === number + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(number + 1)}
                      >
                        {number + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="text-center mt-2">
              Showing {indexOfFirstEntry + 1} to{" "}
              {Math.min(indexOfLastEntry, bills.length)} of {bills.length}{" "}
              entries
            </div>
          </>
        ) : (
          <h1>No Rejected Bills founds</h1>
        )}
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default RejectedByHOD;
