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
import InvoiceTable from "./Components/Pages/InvoiceTable";
import Dashboard from "./Components/Pages/Dashboard";
import EnquiryTable from "./Components/Pages/EnquiryTable";
import ClientApprovalTable from "./Components/Pages/ClientApprovalTable";
import AgreementTable from "./Components/Pages/AgreementTable";
import ViewProposal from "./Components/Pages/ViewProposal";
import ViewInvoice from "./Components/Pages/ViewInvoice";
import ViewAgreement from "./Components/Pages/ViewAgreement";
import SettingsPage from "./Components/Pages/SettingPage";
import UnassignedAuditTable from "./Components/Pages/UnassignedAuditTable";
import AssignedAuditCard from "./Components/Pages/AssignedAuditCard";
import AuditForm from "./Components/Pages/AuditForm";
import AuditReport from "./Components/Pages/AuditReport";
import SubmittedForApproval from "./Components/Pages/SubmittedForApproval";
import RejectedAuditCard from "./Components/Pages/RejectedAuditCard";
import DraftAuditCard from "./Components/Pages/DraftAuditCard";
import UpdateAuditReport from "./Components/Pages/UpdateAuditReport";
import ApprovedAuditCard from "./Components/Pages/ApprovedAuditCard";
import UpdateFssaiAudit from "./Components/Pages/UpdateFssaiForm";
import {
  AccountAdminRoute,
  AuditAdminRoute,
} from "./Components/Context/ProtectedRoute";
import Check from "./Components/Pages/Check";
import Arun from "./Components/Pages/Arun";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/check" element={<Check />} />
        <Route path="/arun" element={<Arun />} />
        <Route path="/arun" element={<Arun />} />
        <Route path="/updatefssai/:audit_id" element={<UpdateFssaiAudit />} />

        <Route element={<AccountAdminRoute />}>
          <Route path="/enquiry" element={<EnquiryTable />} />
          <Route path="/client-approval" element={<ClientApprovalTable />} />
          <Route path="/client-profile" element={<ClientTable />} />
          <Route path="/invoice" element={<InvoiceTable />} />
          <Route path="/proposal" element={<ProposalTable />} />
          <Route path="/agreement" element={<AgreementTable />} />
          <Route path="/add" element={<BusinessDetail />} />
          <Route
            path="/proposal/view-proposal/:proposalId"
            element={<ViewProposal />}
          />
          <Route
            path="/invoice/view-invoice/:invoiceId"
            element={<ViewInvoice />}
          />
          <Route
            path="/agreement/view-agreement/:agreementId"
            element={<ViewAgreement />}
          />
          <Route path="/setting" element={<SettingsPage />} />
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

        {/* <Route element={<AuditAdminRoute />}>
      
          <Route path="/audit-work" element={<UnassignedAuditTable />} />
          <Route path="/assigned-audit" element={<AssignedAuditCard />} />
          <Route path="/draft" element={<DraftAuditCard/>} />
          <Route path="/rejected" element={<RejectedAuditCard/>} />
          <Route path="/approved" element={<ApprovedAuditCard/>} />
          <Route path="/submittedForApproval" element={<SubmittedForApproval/>} />
          <Route path="/audit-form/:audit_id" element={<AuditForm />} />
          <Route path="/audit-report/:audit_id" element={<AuditReport />} />
          <Route path="/updateAuditReport/:audit_id" element={<UpdateAuditReport />} />
        </Route> */}

        <Route element={<AuditAdminRoute />}>
          {/* Main Audit Routes */}
          <Route path="/audit-work" element={<UnassignedAuditTable />} />
          <Route path="/assigned-audit" element={<AssignedAuditCard />} />
          <Route path="/draft" element={<DraftAuditCard />} />
          <Route path="/rejected" element={<RejectedAuditCard />} />
          <Route path="/approved" element={<ApprovedAuditCard />} />
          <Route
            path="/submittedForApproval"
            element={<SubmittedForApproval />}
          />

          {/* Nested Routes for Audits - Avoid Repeating Main Route Segment */}

          {/* Assigned Audits */}
          <Route
            path="/assigned-audit/audit-form/:audit_id"
            element={<AuditForm />}
          />
          <Route
            path="/assigned-audit/audit-form/audit-report/:audit_id"
            element={<AuditReport />}
          />
          <Route
            path="/assigned-audit/audit-form/updateAuditReport/:audit_id"
            element={<UpdateAuditReport />}
          />

          {/* Draft Audits */}
          <Route path="/draft/audit-form/:audit_id" element={<AuditForm />} />
          <Route
            path="/draft/audit-form/audit-report/:audit_id"
            element={<AuditReport />}
          />
          <Route
            path="/draft/audit-form/updateAuditReport/:audit_id"
            element={<UpdateAuditReport />}
          />

          {/* Rejected Audits */}
          <Route
            path="/rejected/audit-form/:audit_id"
            element={<AuditForm />}
          />
          <Route
            path="/rejected/audit-form/audit-report/:audit_id"
            element={<AuditReport />}
          />
          <Route
            path="/rejected/audit-form/updateAuditReport/:audit_id"
            element={<UpdateAuditReport />}
          />

          {/* Approved Audits */}
          <Route
            path="/approved/audit-form/:audit_id"
            element={<AuditForm />}
          />
          <Route
            path="/approved/audit-form/audit-report/:audit_id"
            element={<AuditReport />}
          />
          <Route
            path="/approved/audit-form/updateAuditReport/:audit_id"
            element={<UpdateAuditReport />}
          />

          {/* Submitted for Approval Audits */}
          <Route
            path="/submittedForApproval/audit-form/:audit_id"
            element={<AuditForm />}
          />
          <Route
            path="/submittedForApproval/audit-form/audit-report/:audit_id"
            element={<AuditReport />}
          />
          <Route
            path="/submittedForApproval/audit-form/updateAuditReport/:audit_id"
            element={<UpdateAuditReport />}
          />
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
