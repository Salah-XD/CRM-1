import React, { useState } from "react";
import { Radio } from "antd";
import AdminDashboard from "../Layout/AdminDashboard";
import BusinessDetail from "./BussinessDetail";
import OutletDetail from "./OutletDetail";

const AddClient = () => {
  const [selectedOption, setSelectedOption] = useState("addClient");

  const renderComponent = () => {
    switch (selectedOption) {
      case "addClient":
        return <BusinessDetail />;
      case "addOutlet":
        return <OutletDetail />;
      default:
        return null;
    }
  };

  return (
    <AdminDashboard>
      <div className="top-0 z-50 bg-white">
        <div className="mb-4 border-b border-gray-400 shadow-bottom px-4 py-4">
          <h2 className="text-2xl font-semibold">New Client</h2>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Radio.Group
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="w-full flex justify-center" // Ensures radio buttons are centered and take full width
        >
          <Radio.Button
            value="addClient"
            className="w-1/5 border  text-center px-2 border-gray-400" // Set both radio buttons to be 20% of the full width and add gray border
            style={{
              backgroundColor:
                selectedOption === "addClient" ? "#16A7B9" : "#E5E7EB", // Set background color to blue when selected, light gray otherwise
              color: selectedOption === "addClient" ? "white" : "#6B7280", // Set text color to white when selected
            }}
          >
            Business Detail
          </Radio.Button>
          <Radio.Button
            value="addOutlet"
            className="w-1/5 border  text-center px-2 border-gray-400" // Set both radio buttons to be 20% of the full width and add gray border
            style={{
              backgroundColor:
                selectedOption === "addOutlet" ? "#16A7B9" : "#E5E7EB", // Set background color to blue when selected, light gray otherwise
              color: selectedOption === "addOutlet" ? "white" : "#6B7280", // Set text color to white when selected
            }}
          >
            Outlets
          </Radio.Button>
        </Radio.Group>
      </div>

      <div className="mt-8">{renderComponent()}</div>
    </AdminDashboard>
  );
};

export default AddClient;
