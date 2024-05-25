import React, { useState } from "react";
import axios from "axios";

function OutletForms({ businessId }) {
  const [details, setDetails] = useState({
    outletName: "",
    outletAddress: "",
  });
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate an API call with a timeout
      setTimeout(() => {
        // Mock response
        console.log("Outlet Details Saved:", { ...details, businessId });
        setIsFormDisabled(true); // Disable the form after successful submission
      }, 1000); // 1-second delay to simulate network latency
    } catch (error) {
      console.error("Failed to save outlet details", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Outlet Name:</label>
        <input
          type="text"
          name="outletName"
          value={details.outletName}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border rounded"
          disabled={isFormDisabled}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Outlet Address:</label>
        <input
          type="text"
          name="outletAddress"
          value={details.outletAddress}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border rounded"
          disabled={isFormDisabled}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
        disabled={isFormDisabled}
      >
        {isFormDisabled ? "Submitted" : "Submit"}
      </button>
    </form>
  );
}

export default OutletForms;
