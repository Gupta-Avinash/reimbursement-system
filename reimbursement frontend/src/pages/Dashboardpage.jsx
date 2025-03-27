import React from "react";
import Navbar from "../components/Navbar";
import Metric from "../components/Metric";
import ExcelfilewithDates from "../components/ExcelfilewithDates";

const Dashboardpage = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Metric></Metric>
      <ExcelfilewithDates></ExcelfilewithDates>
      <></>
    </div>
  );
};

export default Dashboardpage;
