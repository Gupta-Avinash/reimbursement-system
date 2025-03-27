import React, { useState } from "react";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import backend_url from "../axios";
import { useUsers } from "../context/UsersContext";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ShowUsers = () => {
  const location = useNavigate();
  const { users, setUsers, deleteUsers } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

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
        let response = await axios.get(`${backend_url}/users/showall`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.message);
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
      let response = await axios.delete(`${backend_url}/users/${ID}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
      deleteUsers(ID);
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
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users
    ? users.slice(indexOfFirstUser, indexOfLastUser)
    : [];
  const totalPages = users ? Math.ceil(users.length / usersPerPage) : 0;

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
      <nav aria-label="Users pagination" className="mt-4">
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

  return (
    <div>
      <Navbar></Navbar>

      <div className="container my-3 mb-5">
        <h2>All Users</h2>
        {users && users.length > 0 ? (
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
                      Role
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
                  {currentUsers.map((u, index) => (
                    <tr key={u._id}>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {indexOfFirstUser + index + 1}
                      </td>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {u.Name}
                      </td>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {u.Email}
                      </td>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {u.Department}
                      </td>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {u.Organization}
                      </td>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {u.Roles}
                      </td>
                      <td
                        style={{
                          border: "1px solid #333",
                          textAlign: "center",
                          padding: "8px",
                        }}
                      >
                        {u.DateOfJoining}
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
                            onClick={() => handleDelete(u._id)}
                          >
                            Delete
                          </button>

                          <button
                            className="btn btn-primary w-100 w-sm-auto"
                            onClick={() => location(`/Edit/User/${u._id}`)}
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

            {/* Display entries range information */}
            <div className="text-center mt-3">
              <p>
                Showing {indexOfFirstUser + 1} to{" "}
                {Math.min(indexOfLastUser, users.length)} of {users.length}{" "}
                users
              </p>
            </div>
          </>
        ) : (
          <h1>Not found</h1>
        )}
      </div>

      <ToastContainer></ToastContainer>
    </div>
  );
};

export default ShowUsers;
