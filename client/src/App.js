import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ClientTable from "./Components/Pages/ClientTable";
import AddClientForm from "./Components/Pages/AddClient";
import BusinessDetail from "./Components/Pages/BussinessDetail";
import UpdateBussinessDetail from "./Components/Pages/UpdateBussinessDetail";
import OutletDetail from "./Components/Pages/OutletDetail";
import ClientOnboarding from "./Components/Pages/ClientOnboarding";
import AdminDashboard from "./Components/Layout/AdminDashboard";
import ClientOnboardingSuccess from "./Components/Pages/ClientOnboardingSuccess";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ClientTable />} />
        <Route path="/add-business" element={<BusinessDetail />} />
        <Route
          path="/update-business/formId/:formId"
          element={<UpdateBussinessDetail />}
        />
        <Route
          path="/update-business/id/:id"
          element={<UpdateBussinessDetail />}
        />
        <Route
          path="/add-client"
          element={
            <AdminDashboard>
              <AddClientForm newClientTitle="New Client" />
            </AdminDashboard>
          }
        />
        <Route path="/add-outlet" element={<OutletDetail />} />
        <Route path="/client-onboarding/:formId" element={<ClientOnboarding />} />
        <Route path="/client-success/:formId" element={<ClientOnboardingSuccess />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
