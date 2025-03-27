import React from "react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import backend_url from "../axios";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AlertImagePopup from "../components/AlertImagePopup";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [bills, setbills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage] = useState(10);
  const location = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      let token = localStorage.getItem("accessToken");
      if (!token) {
        return location("/login");
      }
      let reponse = await axios.get(`${backend_url}/expenses/`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setbills(reponse.data.message);
      // console.log(reponse.data.message);
    };
    fetch();
  }, []);

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
      <Navbar />

      <div className="container my-3 mb-5">
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
                      {" "}
                      Status
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
                  {currentBills.map((bill, index) => (
                    <tr key={bill._id}>
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
                        {bill.Approval_HOD && bill.Approval_Manager ? (
                          <p className="bg-success rounded">Pay</p>
                        ) : bill.Rejected_HOD || bill.Rejected_Manager ? (
                          <p className="bg-danger rounded">Pay Failed</p>
                        ) : (
                          <p className="bg-secondary rounded">
                            Approval Pending
                          </p>
                        )}
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
                        {bill.Expense_type == "Others" ? (
                          <p>
                            {bill.Expense_type} | {bill.Otherinfo}
                          </p>
                        ) : (
                          <p>
                            {bill.Expense_type} | {bill.Vehicle}
                          </p>
                        )}
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
          <h1>No Bills found</h1>
        )}
      </div>
    </>
  );
};

export default Home;
