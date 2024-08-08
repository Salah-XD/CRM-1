import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ClientTable from "./Components/Pages/ClientTable";
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
import Dashboard from "./Components/Pages/Dashboard";
import AddUserPage from "./Components/Auth/AddUserPage";
import EnquiryTable from "./Components/Pages/EnquiryTable";
import ClientApprovalTable from "./Components/Pages/ClientApprovalTable";
import AgreementTable from "./Components/Pages/AgreementTable";
import ViewProposal from "./Components/Pages/ViewProposal";
import { SuperAdminRoute,AccountAdminRoute,AuditAdminRoute} from "./Components/Context/ProtectedRoute";




function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route element={<SuperAdminRoute />}>
          <Route path="/add-user" element={<AddUserPage />} />
        </Route>

        <Route element={<AccountAdminRoute />}>
          <Route path="/enquiry" element={<EnquiryTable />} />
          <Route path="/client-approval" element={<ClientApprovalTable />} />
          <Route path="/client-profile" element={<ClientTable />} />
          <Route path="/invoice" element={<InvoiceTable />} />
          <Route path="/proposal" element={<ProposalTable />} />
          <Route path="/agreement" element={<AgreementTable />} />
          <Route path="/add" element={<BusinessDetail />} />
          <Route path="/proposal/view-proposal/:proposalId" element={<ViewProposal />} />
          <Route
            path="/client-profile/add-business"
            element={
              <AdminDashboard>
                <AddClient newClientTitle={"Client Details Form"}>
                  <BusinessDetail />
                </AddClient>
              </AdminDashboard>
            }
          />
        </Route>

        <Route element={<AuditAdminRoute />}>
          <Route path="/audit-plan" element={<AuditPlan />} />
          <Route path="/agreement" element={<Agreement />} />
        </Route>

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
