import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import backend_url from "../axios";
import { useEffect } from "react";
import { useCustomer } from "../context/CustomerContex";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShowCustomer = () => {
  const location = useNavigate();
  const { customers, setCustomers, deleteCustomers } = useCustomer();
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  useEffect(() => {
    async function fetch() {
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
        let response = await axios.get(`${backend_url}/customer/show`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setCustomers(response.data.message);
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

  const handleDelete = async (ID) => {
    let token = localStorage.getItem("accessToken");
    try {
      let response = await axios.delete(`${backend_url}/customer/${ID}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      deleteCustomers(ID);
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

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers
    ? customers.slice(indexOfFirstCustomer, indexOfLastCustomer)
    : [];
  const totalPages = customers
    ? Math.ceil(customers.length / customersPerPage)
    : 0;

  // Change page function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Next and previous page functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Pagination UI component
  const PaginationComponent = () => {
    const pageNumbers = [];

    // Calculate range of page numbers to display
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // Adjust start page if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav aria-label="Customer pagination" className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {startPage > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => paginate(1)}>
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}

          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => paginate(number)}>
                {number}
              </button>
            </li>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => paginate(totalPages)}
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const renderAddresses = (addresses) => {
    // Ensure addresses is an array, if it's a string convert to single-item array
    const addressArray = JSON.parse(addresses)

    return (
      <ul className="list-unstyled m-0 p-0">
        {addressArray.map((address, index) => (
          <li key={index} className="mb-1">
            {address}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <Navbar></Navbar>

      <div className="container my-3 mb-5">
        <h2>All Customers</h2>
        {customers && customers.length > 0 ? (
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
                      Name
                    </th>
                    <th
                      style={{
                        border: "1px solid #333",
                        textAlign: "center",
                        padding: "10px",
                      }}
                    >
                      Email
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
                      Date Of Joining
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
                  {currentCustomers.map((customer, index) => (
                    <tr key={customer._id}>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {indexOfFirstCustomer + index + 1}
                      </td>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {customer.Name}
                      </td>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {customer.Email}
                      </td>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {renderAddresses(customer.Address)}
                      </td>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {customer.Date}
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
                            className="btn btn-danger w-100 w-sm-auto"
                            onClick={() => handleDelete(customer._id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-primary w-100 w-sm-auto"
                            onClick={() =>
                              location(`/Edit/Customer/${customer._id}`)
                            }
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination component */}
            <PaginationComponent />

            {/* Showing current range status */}
            <div className="text-center mt-3">
              <p>
                Showing {indexOfFirstCustomer + 1} to{" "}
                {Math.min(indexOfLastCustomer, customers.length)} of{" "}
                {customers.length} customers
              </p>
            </div>
          </>
        ) : (
          <h1>Customer Not Found</h1>
          // <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
          //   <h1 className="text-primary fw-bold">No Customers Added Yet</h1>
          //   <p className="text-muted">Start building your customer list by adding a new customer.</p>
          //   <button className="btn btn-success" onClick={() => location('/Create/Customer')}>
          //     Add New Customer
          //   </button>
          // </div>
        )}
      </div>

      <ToastContainer></ToastContainer>
    </div>
  );
};
