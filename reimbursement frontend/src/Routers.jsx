import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { CreateBills } from "./pages/CreateBills";
import { ShowBills } from "./pages/ShowBills";
import CreateUser from "./pages/CreateUser";
import ShowUsers from "./pages/ShowUsers";
import { CreateCustomer } from "./pages/CreateCustomer";
import { ShowCustomer } from "./pages/ShowCustomer";
import Reimburement from "./pages/Reimburement";
import ApprovedByManager from "./pages/ApprovedByManager";
import RejectedByManager from "./pages/RejectedByManager";
import { BillsProvider } from "./context/BillsContext";
import { UsersProvider } from "./context/UsersContext";
import { CustomersProvider } from "./context/CustomerContex";
import ReimburementPhaseSecond2 from "./pages/ReimburementPhaseSecond2";
import { HODProvider } from "./context/HODApprovalContex";
import ViewBillByManager from "./pages/ViewBillByManager";
import ViewBillByHOD from "./pages/ViewBillByHOD";
import EditUserPage from "./pages/EditUserPage";
import EditCustomer from "./pages/EditCustomer";
import EditBills from "./pages/EditBills";
import Dashboardpage from "./pages/Dashboardpage";
import { ManagerProvider } from "./context/MangerApprovalContext";
import ApprovedByHOD from "./pages/ApprovedByHOD";
import RejectedByHOD from "./pages/RejectedByHOD";

export const Routers = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/Dashboard" element={<Dashboardpage></Dashboardpage>}></Route>
          <Route
            path="/Create/User"
            element={<CreateUser></CreateUser>}
          ></Route>
          <Route
            path="/Edit/User/:id"
            element={
              <UsersProvider>
                <EditUserPage />
              </UsersProvider>
            }
          ></Route>
          <Route
            path="/Create/Customer"
            element={<CreateCustomer></CreateCustomer>}
          ></Route>
          <Route
            path="/Edit/Customer/:id"
            element={<EditCustomer></EditCustomer>}
          ></Route>
          <Route
            path="/Create/ExpenseBill"
            element={<CreateBills></CreateBills>}
          ></Route>
          <Route
            path="/Edit/ExpenseBill/:id"
            element={<EditBills></EditBills>}
          ></Route>
          <Route
            path="/Reimbursement/phase2"
            element={
              <HODProvider>
                <ReimburementPhaseSecond2 />
              </HODProvider>
            }
          ></Route>
          <Route
            path="/Reimbursement/phase2/view/:id"
            element={<ViewBillByHOD></ViewBillByHOD>}
          ></Route>
          <Route
            path="/Reimbursement/phase2/Approved"
            element={<ApprovedByHOD></ApprovedByHOD>}
          ></Route>
          <Route
            path="/Reimbursement/phase2/Rejected"
            element={<RejectedByHOD></RejectedByHOD>}
          ></Route>
          <Route
            path="/Reimbursement"
            element={
              <ManagerProvider>
                <Reimburement />
              </ManagerProvider>
            }
          ></Route>
          <Route
            path="/Reimbursement/view/:id"
            element={<ViewBillByManager></ViewBillByManager>}
          ></Route>
          <Route
            path="/Reimbursement/Approved"
            element={<ApprovedByManager> </ApprovedByManager>}
          ></Route>
          <Route
            path="/Reimbursement/Rejected"
            element={<RejectedByManager></RejectedByManager>}
          ></Route>

          <Route
            path="/Show/ExpenseBill"
            element={
              <BillsProvider>
                <ShowBills />
              </BillsProvider>
            }
          ></Route>
          <Route
            path="/Show/Customer"
            element={
              <CustomersProvider>
                <ShowCustomer />
              </CustomersProvider>
            }
          ></Route>
          <Route
            path="/Show/User"
            element={
              <UsersProvider>
                <ShowUsers />
              </UsersProvider>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
