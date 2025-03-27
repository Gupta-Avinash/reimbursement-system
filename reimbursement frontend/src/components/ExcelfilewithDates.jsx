import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import backend_url from "../axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const ExcelfilewithDates = () => {
  const [dates, setDates] = useState({
    from: "",
    to: "",
  });

  const [maxDate, setMaxDate] = useState("");
  useEffect(() => {
    const today = new Date();

    setMaxDate(today.toISOString().split("T")[0]); // Today's date in YYYY-MM-DD
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let token = localStorage.getItem("accessToken");
    async function fetch() {
      try {
        let response = await axios.post(
          `${backend_url}/Dashboard/download`,
          dates,
          {
            responseType: "blob",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `Expenses.xlsx`;
        link.click();

        window.URL.revokeObjectURL(url);
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDates({ ...dates, [name]: value });
  };

  return (
    <div className="container my-3 mb-5">
      <h1>Bills Spreadsheet</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Form:</label>
            <input
              type="date"
              className="form-control"
              name="from"
              value={dates.from}
              onChange={handleChange}
              max={maxDate}
            />
          </div>
          <div className="mb-3">
            <label>To:</label>
            <input
              type="date"
              className="form-control"
              name="to"
              value={dates.to}
              onChange={handleChange}
              max={maxDate}
            />
          </div>
          {/* Submit Button */}
          <button type="submit" className="btn btn-primary me-2">
            Submit
          </button>

          <button type="reset" className="btn btn-danger">
            Clear
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExcelfilewithDates;
