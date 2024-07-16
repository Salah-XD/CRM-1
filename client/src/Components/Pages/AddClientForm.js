import React, { useState } from "react";
import { Radio } from "antd";
import BusinessDetail from "./BussinessDetail";
import OutletDetail from "./OutletDetail";
import toast from "react-hot-toast";
import axios from "axios";

const AddClient = ({ newClientTitle }) => {
  const [selectedOption, setSelectedOption] = useState("addClient");
  const [isBusinessSaved, setIsBusinessSaved] = useState(false);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBusinessSubmit = async (details) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/saveClientData", details);
      if (data?.success) {
        setBusinessId(data.data._id);
        console.log("this is data" + data.data._id);
        setIsBusinessSaved(true);
        setSelectedOption("addOutlet");
        toast.success("Client Added Successfully");
      } else {
        console.error("Failed to save business details");
        toast.error("Failed to save business details");
      }
    } catch (error) {
      console.error("Error saving business details", error);
      toast.error("Error saving business details");
    }
    setLoading(false);
  };

  const renderComponent = () => {
    switch (selectedOption) {
      case "addClient":
        return (
          <BusinessDetail
            onSubmit={handleBusinessSubmit}
            loading={loading}
            disabled={isBusinessSaved}
          />
        );
      case "addOutlet":
        return isBusinessSaved ? (
          <OutletDetail businessId={businessId} />
        ) : null;
      default:
        return null;
    }
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
          onChange={(e) => setSelectedOption(e.target.value)}
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
            disabled={isBusinessSaved}
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
            disabled={!isBusinessSaved}
          >
            Outlets
          </Radio.Button>
        </Radio.Group>
      </div>

      <div className="mt-8">{renderComponent()}</div>
    </>
  );
};

export default AddClient;
