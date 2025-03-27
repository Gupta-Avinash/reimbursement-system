import React, { useEffect, useState } from "react";
import backend_url from "../axios";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
const Metric = () => {
  const [metricdata, setMetricdata] = useState([]);

  useEffect(() => {
    async function fetch() {
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
        let response = await axios.get(
          `${backend_url}/Dashboard`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setMetricdata(response.data.message);
      } catch (error) {
        if (axios.isAxiosError) {
          toast.error(error?.response?.data?.message, {
            position: "top-right",
            autoClose: 1000,
          });
        } else {
          toast.error(error.message, {
            position: "top-right",
            autoClose: 1000,
          });
        }
      }
    }
    fetch();
  }, []);

  return (
    <>
      {metricdata ? (
        <div>
          {metricdata.map((data, index) => (
            <div className="container p-4" key={index}>
              <div className="row mb-3">
                <div
                  className="col-12 col-md-6 mb-3 mb-md-0"
                  style={{ border: "1px solid #333" }}
                >
                  <div className="p-4 bg-gray-200 rounded-lg h-full">
                    <h4 className="text-xl font-bold mb-2">Users</h4>
                    <h1>{data.mergedData.Users}</h1>
                  </div>
                </div>

                <div
                  className="col-12 col-md-6"
                  style={{ border: "1px solid #333" }}
                >
                  <div className="p-4 bg-gray-200 rounded-lg h-full">
                    <h4 className="text-xl font-bold mb-2">Customers</h4>
                    <h1>{data.mergedData.customers}</h1>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div
                  className="col-12 col-md-6 mb-3 mb-md-0"
                  style={{ border: "1px solid #333" }}
                >
                  <div className="p-4 bg-gray-200 rounded-lg h-full">
                    <h4 className="text-xl font-bold mb-2">Bills</h4>
                    <h1>{data.mergedData.Bills}</h1>
                  </div>
                </div>

                <div
                  className="col-12 col-md-6 mb-3 mb-md-0"
                  style={{ border: "1px solid #333" }}
                >
                  <div className="p-4 bg-gray-200 rounded-lg h-full">
                    <h4 className="text-xl font-bold mb-2">Total Amount</h4>
                    <h1>{data.mergedData.TotalAmount}</h1>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div
                  className="col-12 col-md-6 mb-3 mb-md-0"
                  style={{ border: "1px solid #333" }}
                >
                  <div className="p-4 bg-gray-200 rounded-lg h-full">
                    <h4 className="text-xl font-bold mb-2"> Approved Bills</h4>
                    <h1>{data.mergedData.ApprovedBills}</h1>
                  </div>
                </div>

                <div
                  className="col-12 col-md-6"
                  style={{ border: "1px solid #333" }}
                >
                  <div className="p-4 bg-gray-200 rounded-lg h-full">
                    <h4 className="text-xl font-bold mb-2">
                      {" "}
                      Approved Bills Total Amount
                    </h4>
                    <h1>{data.mergedData.Approved_Amount}</h1>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h1>No data found</h1>
        </div>
      )}
      <ToastContainer></ToastContainer>
    </>
  );
};

export default Metric;
