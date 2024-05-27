import React, { useState } from "react";
import { Radio, Button } from "antd";
import UpdateBusinessDetail from "./UpdateBussinessDetail"
import UpdateOutlet from "./UpdateOutlet";

const UpdateClient = ({ newClientTitle }) => {
  const [selectedOption, setSelectedOption] = useState("addClient");
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [showUpdateButtons, setShowUpdateButtons] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(true);

  const handleUpdate = () => {
    setIsEditable(true);
    setShowUpdateButtons(true);
    setShowUpdateButton(false);
  };

  return (
    <>
      <div className="top-0 z-50 bg-white">
        <div className="mb-4 border shadow-bottom px-4 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{newClientTitle}</h2>
          {showUpdateButton && (
            <Button type="primary" onClick={handleUpdate}>
              Update
            </Button>
          )}
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

      <div className="mt-8">
        {selectedOption === "addClient" && (
          <UpdateBusinessDetail
            isEditable={isEditable}
            loading={loading}
            setLoading={setLoading}
            showUpdateButtons={showUpdateButtons}
            setBusinessId={setBusinessId} // Pass the setBusinessId function
          />
        )}
        {selectedOption === "addOutlet" && (
          <UpdateOutlet businessId={businessId} />
        )}
      </div>
    </>
  );
};

export default UpdateClient;
