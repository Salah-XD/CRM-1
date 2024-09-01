import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminDashboard from "../Layout/AdminDashboard";
import moment from "moment";
import { Spin, Button } from "antd";
import UpdateGenerateInvoiceModal from "./UpdateGenerateInvoiceModal";

import "../css/view.css";

const ViewInvoice = () => {
  const { invoiceId } = useParams(); // Extract invoiceId from the route
  const [invoiceData, setinvoiceData] = useState(null);
  const [zoom, setZoom] = useState(1); // State to manage zoom level
  const [noteContent, setNoteContent] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Inject data into HTML template
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
  <style>
    body {
      background-color: #ffffff;
      font-size: 11px;
      /* Increased font size */
    }

    .container {
      background-color: #ffffff;
      padding: 10px;
      /* Increased padding */
      max-width: 100%;
      margin: auto;
    }

    .container {
      width: 793px;
      /* A4 width in pixels */
      margin-left: auto;
      margin-right: auto;
    }

    table {
      border-collapse: collapse;
      font-size: 11px;
      /* Increased font size */
    }

    th {
      background-color: #edf2f7;
    }

    th,
    td {
      border: 1px solid #e2e8f0;
      padding: 4px 6px;
      /* Increased padding */
    }

    .header-info,
    .bill-info,
    .total-info,
    .bank-info,
    .declaration,
    .signature {
      margin-bottom: 6px;
      /* Increased margin */
    }

    .header-info h2,
    .bill-info h2,
    .bank-info h2,
    .declaration h2 {
      font-size: 13px;
      /* Increased font size */
    }

    .text-right p {
      margin: 0;
    }

    .content-box {
      position: relative;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)),
        url("data:image/png;base64,{{imageData}}");

      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
    }
  </style>
</head>

<body class="p-4">
  <div class="container mx-auto mt-4">
    <div class="header-info flex justify-between items-center border p-2 border-gray-400 rounded">
      <div>
        <h2 class="text-lg font-bold" style="color: #13A6B8;">UNAVAR FOOD INSPECTION AND CERTIFICATION PRIVATE LIMITED
        </h2>
        <p style="color: #13A6B8;">MM ILLAM MKN ROAD, ALANDUR CHENNAI - 600016.</p>
        <p style="color: #13A6B8;">Tel: + 9894398096 | Email: vivekanand@unavar.com</p>
        <p style="color: #13A6B8;">GSTIN: 33AADCU1306M1ZI | PAN: AADCU1306M</p>
      </div>
      <img src="data:image/png;base64,{{imageData}}" alt="Your Image Alt Text" width="80" height="80" />
    </div>

    <h1 class="text-xl font-bold my-2 text-center text-gray-700">TAX INVOICE</h1>
    <div class="content-box">
    <div class="grid grid-cols-2 gap-2 mb-2">
      <div>
        <p><span class="font-semibold">Invoice No:</span> {{invoice_number}}</p>
        <p><span class="font-semibold">Invoice Date:</span> {{invoice_date}}</p>
        <p><span class="font-semibold">Order Ref No:</span> {{proposal_number}}</p>
        <p><span class="font-semibold">Cust. P.O. No:</span> {{Cust. P.O. No}}</p>
      </div>
      <div>
        <p><span class="font-semibold">Field Executive Name:</span>{{field_executive_name}}</p>
        <p><span class="font-semibold">Team Leader Name:</span>{{team_leader_name}}</p>
      </div>
    </div>

    <div class="bill-info mb-2">
      <h2 class="text-md font-semibold text-gray-700">Bill to Party</h2>
      <p><span class="font-semibold">Name:</span> {{fbo_name}}</p>
      <p><span class="font-semibold">Address:</span> {{address}}</p>
      <p><span class="font-semibold">GSTIN:</span> {{gst_number}}</p>
      <p><span class="font-semibold">State (Place of Supply):</span> {{place_of_supply}}</p>
      <p><span class="font-semibold">pincode Code:</span> {{pincode}}</p>
    </div>

    <div class="mb-2">
      <p><span class="font-semibold">SAC:</span> 998399 (18%)</p>
    </div>

    <table class="table-auto w-full my-6">
      <thead>
        <tr>
          <th class="px-2 py-1 text-center">Outlet Name</th>
          <th class="px-2 py-1 text-center">Description</th>
          <th class="px-2 py-1 text-center">Service</th>
          <th class="px-2 py-1 text-center">Man Days</th>
          <th class="px-2 py-1 text-center">Qty</th>
          <th class="px-2 py-1 text-center">Unit Cost</th>
          <th class="px-2 py-1 text-center">Amount</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr>
            <td class="px-2 py-1">{{outlet_name}}</td>
            <td class="px-2 py-1">{{no_of_food_handlers}}</td>
            <td class="px-2 py-1">{{man_days}}</td>
            <td class="px-2 py-1">{{unit_cost}}</td>
            <td class="px-2 py-1">{{discount}}</td>
            <td class="px-2 py-1">{{amount}}</td>
          </tr> -->
        {{outletItems}}
        <tr>
          <td class="px-2 py-1 font-bold text-right" colspan="5">Sub Total</td>
          <td class="px-2 py-1 font-bold text-center ">{{sub_total}}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-info mb-2">
      <p class="font-semibold text-gray-700 mb-4">
        Total Invoice amount in words:
        <span class="font-normal">{{totalInWords}}</span>
      </p>
      <p><span class="font-semibold">Total Amount before Tax:</span>{{sub_total}}</p>
      <p><span class="font-semibold">Add: CGST(9%):</span>{{cgst}}</p>
      <p><span class="font-semibold">Add: SGST(9%):</span>{{sgst}}</p>
      <p><span class="font-semibold">Total Amount after Tax:</span>{{overallTotal}}</p>
      <p><span class="font-semibold">Gst On Reverse Charge:</span>{{Gst Charge}}</p>
    </div>

    <div class="bank-info my-2">
      <h2 class="text-md font-semibold text-gray-700">Bank Account Details</h2>
      <p><span class="font-semibold">Account Holder's Name:</span> UNAVAR FOOD INSPECTION AND CERTIFICATION PVT LTD</p>
      <p><span class="font-semibold">Bank Name:</span> HDFC BANK</p>
      <p><span class="font-semibold">Bank Branch:</span> West Mambalam</p>
      <p><span class="font-semibold">IFSC Code:</span> HDFC0000575</p>
      <p><span class="font-semibold">Account No:</span> 50200078830737</p>
    </div>

    <div class="declaration my-2">
      <h2 class="text-md font-semibold text-gray-700">Declaration:</h2>
      <p>1. E& O.E,</p>
      <p>2. Please Quote Invoice no while making payment,</p>
      <p>3. Invoice Payable within 7 days failing which interest @2% per month will be charged.</p>
      <br />
      <p class="font-semibold text-gray-700">Udyog Aadhar No. UDYAM-TN-02-0162170</p>
      <p>Payment to be made as per our agreed terms. Delay in payment to us beyond 45 days from the date of receipt of
        invoice would attract interest of 24% p.a. as per MSMED Act, 2006.</p>
    </div>

    <div class="signature text-right mt-4">
      <p class="font-semibold">Certified that the particulars given above are true and correct</p>
      <p>For UNAVAR Food Inspection & Certification Pvt Ltd</p>
      <p class="mt-2">Authorised signatory</p>
    </div>
  </div>
</body>

</html>`;

  return (
    <div>
      <AdminDashboard>
        <div className="top-0 z-50 bg-white">
          <div className="mb-10 border shadow-bottom px-4 py-4 flex items-center">
            <span
              onClick={() => navigate(-1)}
              className="cursor-pointer text-3xl mr-4"
            >
              ←
            </span>
            <h2 className="text-xl font-semibold">View Invoice Document</h2>
            <Button type="primary" className="ml-auto" onClick={showModal}>
              Edit
            </Button>
          </div>
        </div>

        <>
          <div className="fixed bottom-4 right-4 flex items-center space-x-4">
            <button
              onClick={() =>
                setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5))
              }
              className="px-4 py-2 bg-gray-200 border border-gray-400 rounded"
            >
              -
            </button>
            <span className="text-lg">Zoom: {Math.round(zoom * 100)}%</span>
            <button
              onClick={() =>
                setZoom((prevZoom) => Math.min(prevZoom + 0.1, 1.1))
              }
              className="px-4 py-2 bg-gray-200 border border-gray-400 rounded"
            >
              +
            </button>
          </div>

          <div className="flex justify-center">
            <div
              className=""
              style={{
                width: `${793 * zoom}px`, // Adjust width based on zoom
                transform: `scale(${zoom})`,
                transformOrigin: "center", // Center the zoom effect
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: htmlTemplate }} />
            </div>
          </div>
          <UpdateGenerateInvoiceModal
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            invoiceId={invoiceId}
          />
        </>
      </AdminDashboard>
    </div>
  );
};

export default ViewInvoice;
