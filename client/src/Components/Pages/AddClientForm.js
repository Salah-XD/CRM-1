import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const AddClientForm = ({ newClientTitle, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("addClient");

  useEffect(() => {
    const route = location.pathname;
    setSelectedOption(
      route.includes("add-business-form") ? "addClient" : "addOutlet"
    );
  }, [location]);

  const handleNavigation = (value) => {
    setSelectedOption(value);
    const route = value === "addClient" ? "/add-business-form" : "/add-outlet-form";
    navigate(route);
  };

  return (
    <>
      <div className="top-0 z-50 bg-white">
        <div className="mb-4 border shadow-bottom px-4 py-4">
          <h2 className="text-2xl font-semibold">{newClientTitle}</h2>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Radio.Group
          value={selectedOption}
          onChange={(e) => handleNavigation(e.target.value)}
          className="w-full flex justify-center"
        >
          <Radio.Button
            value="addClient"
            className="w-1/5 border text-center px-2 border-gray-400"
            style={{
              backgroundColor:
                selectedOption === "addClient" ? "#16A7B9" : "#E5E7EB",
              color: selectedOption === "addClient" ? "white" : "#6B7280",
            }}
          >
            Business Detail
          </Radio.Button>
          <Radio.Button
            value="addOutlet"
            className="w-1/5 border text-center px-2 border-gray-400"
            style={{
              backgroundColor:
                selectedOption === "addOutlet" ? "#16A7B9" : "#E5E7EB",
              color: selectedOption === "addOutlet" ? "white" : "#6B7280",
            }}
          >
            Outlets
          </Radio.Button>
        </Radio.Group>
      </div>

      <div className="mt-12">{children}</div>
    </>
  );
};

export default AddClientForm;
