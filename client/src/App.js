import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ClientTable from "./Components/Pages/ClientTable";
import AddClientForm from "./Components/Pages/AddClient";
import BusinessDetail from "./Components/Pages/BussinessDetail";
import OutletDetail from "./Components/Pages/OutletDetail";
import ClientOnboarding from "./Components/Pages/ClientOnboarding";
import AdminDashboard from "./Components/Layout/AdminDashboard";
import ClientOnboardingSuccess from "./Components/Pages/ClientOnboardingSuccess";
import AddClient from "./Components/Pages/AddClientForm";
import UpdateClient from "./Components/Pages/UpdateClient";
import AdminHeader from "./Components/Layout/AdminHeader";
import ProposalTable from "./Components/Pages/ProposalTable";
import LoginPage from "./Components/Auth/LoginPage";
import ForgotPasswordPage from "./Components/Auth/ForgotPassword";
import Agreement from "./Components/Pages/Agreement";
import AuditPlan from "./Components/Pages/AuditPlan";

import InvoiceTable from "./Components/Pages/InvoiceTable";
import ProtectedRoute from "./Components/Context/ProtectedRoute";
import Dashboard from "./Components/Pages/Dashboard";
import AddUserPage from "./Components/Auth/AddUserPage";
import EnquiryTable from "./Components/Pages/EnquiryTable";
import WebEnquiryTable from "./Components/Pages/WebEnquiryTable";




function App() {
  return (
    <>
      <Routes>
        {/* <Route  element={<ProtectedRoute />} >
         <Route path="/dashboard" element={<ClientTable />} />
      </Route> */}

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/enquiry" element={<EnquiryTable />} />
        <Route path="/web-enquiry" element={<WebEnquiryTable />} />
        <Route path="/add-user" element={<AddUserPage />} />
        <Route path="/client-profile" element={<ClientTable />} />
        <Route path="/audit-plan" element={<AuditPlan />} />
        <Route path="/aggrement" element={<Agreement />} />
        {/* <Route path="/enquiry" element={<Enquiry />} /> */}
        <Route path="/invoice" element={<InvoiceTable />} />

        <Route path="/proposal" element={<ProposalTable />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/client-profile/add-business"
          element={
            <AdminDashboard>
              <AddClient newClientTitle={"New Client"}>
                <BusinessDetail />
              </AddClient>
            </AdminDashboard>
          }
        />

        <Route
          path="client-profile/update-client"
          element={
            <>
              <AdminHeader />

              <UpdateClient newClientTitle="Update Client" />
            </>
          }
        />

        <Route
          path="client-profile/update-client-form/id/:id"
          element={
            <>
              <AdminHeader />
              <UpdateClient newClientTitle="Update Client" />
            </>
          }
        />

        <Route
          path="client-profile/update-client/id/:id"
          element={
            <AdminDashboard>
              <UpdateClient newClientTitle="View Client" />
            </AdminDashboard>
          }
        />
        <Route
          path="/add-client"
          element={
            <AdminDashboard>
              <AddClientForm newClientTitle="New Client" />
            </AdminDashboard>
          }
        />
        <Route
          path="/client-profile/add-outlet"
          element={
            <AdminDashboard>
              <OutletDetail />
            </AdminDashboard>
          }
        />

        <Route path="/client-onboarding" element={<ClientOnboarding />} />
        <Route path="/client-success" element={<ClientOnboardingSuccess />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
