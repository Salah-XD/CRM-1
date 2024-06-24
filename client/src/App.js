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
import Enquiry from "./Components/Pages/Enquiry";
import Invoice from "./Components/Pages/Invoice";
import ProtectedRoute from "./Components/Context/ProtectedRoute";
import Dashboard from "./Components/Pages/Dashboard";




function App() {
  return (
    <>
      <Routes>
        {/* <Route  element={<ProtectedRoute />} >
         <Route path="/dashboard" element={<ClientTable />} />
      </Route> */}

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/client-table" element={<ClientTable />} />
        <Route path="/audit-plan" element={<AuditPlan />} />
        <Route path="/aggrement" element={<Agreement />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/invoice" element={<Invoice />} />

        <Route path="/proposal" element={<ProposalTable />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/add-business"
          element={
            <AdminDashboard>
              <AddClient newClientTitle={"New Client"}>
                <BusinessDetail />
              </AddClient>
            </AdminDashboard>
          }
        />

        <Route
          path="/update-client/formId/:formId"
          element={
            <>
              <AdminHeader />

              <UpdateClient newClientTitle="Update Client" />
            </>
          }
        />

        <Route
          path="/update-client-form/id/:id"
          element={
            <>
              <AdminHeader />
              <UpdateClient newClientTitle="Update Client" />
            </>
          }
        />

        <Route
          path="/update-client/id/:id"
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
          path="/add-outlet"
          element={
            <AdminDashboard>
              <OutletDetail />
            </AdminDashboard>
          }
        />

        <Route
          path="/client-onboarding/:formId"
          element={<ClientOnboarding />}
        />
        <Route
          path="/client-success/:formId"
          element={<ClientOnboardingSuccess />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
