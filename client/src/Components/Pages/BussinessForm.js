import React, { useState } from "react";

const indianStatesAndUTs = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
  "Ladakh",
  "Jammu and Kashmir",
];

const BussinessForm = ({ onSubmit }) => {
  const [details, setDetails] = useState({
    fboName: "",
    contactPerson: "",
    businessType: "",
    fssaiRegistered: false,
    fssaiLicenseNumber: "",
  });

 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">FBO Name:</label>
        <input
          type="text"
          name="fboName"
          value={details.fboName}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Contact Person Name:</label>
        <input
          type="text"
          name="contactPerson"
          value={details.contactPerson}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Business Type:</label>
        <select
          name="businessType"
          value={details.businessType}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border rounded"
        >
          <option value="">Select Type</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Temple">Temple</option>
          <option value="Hotel">Hotel</option>
          <option value="Canteen">Canteen</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="fssaiRegistered"
            checked={details.fssaiRegistered}
            onChange={handleChange}
            className="mr-2"
          />
          FSSAI Registered
        </label>
      </div>
      {details.fssaiRegistered && (
        <div className="mb-4">
          <label className="block text-gray-700">FSSAI License Number:</label>
          <input
            type="text"
            name="fssaiLicenseNumber"
            value={details.fssaiLicenseNumber}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded"
          />
        </div>
      )}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Save
      </button>
    </form>
  );
};

export default BussinessForm;
