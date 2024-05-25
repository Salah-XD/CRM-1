import React, { useState } from "react";
import BusinessForm from "./Components/Pages/BussinessForm";
import OutletForms from "./Components/Pages/OutletForms";
import axios  from "axios";


function App() {
  const [currentTab, setCurrentTab] = useState("business");
  const [isBusinessSaved, setIsBusinessSaved] = useState(false);
  const [businessId, setBusinessId] = useState(null);

  // Mock handleBusinessSubmit function for demo purposes
  const handleBusinessSubmit = async (details) => {
    try {
      // Simulate an API call with a timeout
      setTimeout(() => {
        // Mock response
        const mockResponse = { businessId: "12345" };
        setBusinessId(mockResponse.businessId);
        setIsBusinessSaved(true);
        setCurrentTab("outlet");
        console.log("Business Details Saved:", details);
      }, 1000); // 1-second delay to simulate network latency
    } catch (error) {
      console.error("Failed to save business details", error);
    }
  };
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">New Client</h1>
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 px-4 border ${
            currentTab === "business" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setCurrentTab("business")}
        >
          Business Details
        </button>
        <button
          className={`flex-1 py-2 px-4 border ${
            currentTab === "outlet" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => isBusinessSaved && setCurrentTab("outlet")}
          disabled={!isBusinessSaved}
        >
          Outlets
        </button>
      </div>
      {currentTab === "business" && (
        <BusinessForm onSubmit={handleBusinessSubmit} />
      )}
      {currentTab === "outlet" && isBusinessSaved && (
        <OutletForms businessId={businessId} />
      )}
    </div>
  );
}

export default App;