import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminDashboard from "../Layout/AdminDashboard";
import moment from "moment";
import {Spin,Button } from "antd";


const ViewProposal = () => {
  const { proposalId } = useParams(); // Extract proposalId from the route
  const [proposalData, setProposalData] = useState(null);
  const [zoom, setZoom] = useState(1); // State to manage zoom level
  const [noteContent, setNoteContent] = useState([]);
 const navigate = useNavigate();

  useEffect(() => {
    const fetchProposalData = async () => {
      try {
        const response = await axios.get(
          `/api/proposal/getProposalById/${proposalId}`
        );
        setProposalData(response.data);
      } catch (error) {
        console.error("Error fetching proposal data:", error);
      }
    };

    const fetchNoteContent = async () => {
      try {
        const response = await axios.get(
          `/api/setting/getSetting/66c41b85dedfff785c08df21`
        );
        const formattedNote = response.data.proposal_note.split("\n");
        setNoteContent(formattedNote);
      } catch (error) {
        console.error("Error fetching note content:", error);
      }
    };

    fetchProposalData();
    fetchNoteContent(); 
  }, [proposalId]);

  if (!proposalData) {
    return (
      <AdminDashboard>
        <div className="flex justify-center items-center h-screen">
         <Spin/>
        </div>
      </AdminDashboard>
    );
  }

  const formattedDate = moment(proposalData.proposal_date).format(
    "MMMM D, YYYY"
  );

  // Prepare outlet rows
  const outletRows = proposalData.outlets
    .map((outlet) => {
      const outletName = outlet.outlet_name || "";
      const description = outlet.description || "";
      const service = outlet.service || "";
      const manDays = outlet.man_days?.$numberDouble || outlet.man_days || 0;
      const quantity = outlet.quantity?.$numberInt || outlet.quantity || 0;
      const unitCost = outlet.unit_cost?.$numberInt || outlet.unit_cost || 0;
      const amount = outlet.amount?.$numberInt || outlet.amount || 0;

      return `
      <tr>
        <td class="px-2 py-1 text-center">${outletName}</td>
        <td class="px-2 py-1 text-center">${description}</td>
        <td class="px-2 py-1 text-center">${service}</td>
        <td class="px-2 py-1 text-center">${manDays}</td>
        <td class="px-2 py-1 text-center">${quantity}</td>
        <td class="px-2 py-1 text-center">${unitCost}</td>
        <td class="px-2 py-1 ">${amount}</td>
      </tr>
    `;
    })
    .join("");

  let total = 0;
  proposalData.outlets.forEach((outlet) => {
    total += parseFloat(outlet.amount.$numberInt || outlet.amount);
  });

  const cgst = total * 0.09;
  const sgst = total * 0.09;
  const overallTotal = total + cgst + sgst;

  // Inject data into HTML template
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Quotation</title>
      <!-- Tailwind CSS -->
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        @page {
          size: A4;
          margin: 0;
        }
        html {
          -webkit-print-color-adjust: exact;
        }
        .container {
          width: 793px; /* A4 width in pixels */
          margin: 0 auto; /* Center horizontally */
          transform: scale(${zoom}); /* Adjust scale for zoom effect */
          transform-origin: top left;
          position: relative; /* Allow centering with transform */
        }
        .a4 {
          border: 2px solid black; /* Add border to a4 class */
        }
        .a4 img {
          width: 100%;
          height: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid black;
          padding: 6px; /* Adjust padding for a more professional look */
          text-align: left;
          font-size: 12px; /* Adjust font size */
        }
        .selected-cell {
          background-color: #f2f2f2 !important;
        }
        .small-cell {
          padding: 4px; /* Adjust padding */
        }
        body {
          // background-image: url("../templates/logo2.png"); /* Replace 'path_to_your_image.jpg' with the actual path to your image */
          // background-repeat: repeat-y; /* Repeat the image vertically */
          // background-position: center center; /* Center the background image */
          // background-attachment: fixed; /* Ensure the background image stays fixed as the content scrolls */
          // background-size: contain; /* Resize the background image to fit the container */
        }
        .page-break-before {
          page-break-before: always;
        }
      </style>
    </head>
    <body class="bg-white text-xs">
      <div class="container bg-white rounded-lg p-4">
        <div class="flex p-2 header items-center border mb-4">
          <div class="w-1/5">
            <img src="/logo.png" alt="Your Image Alt Text" width="80" height="80" />
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-800">
              Unavar Food Inspection and Certification Private Limited
            </h1>
          </div>
        </div>
        <div class="mt-5">
          <table id="clientProposalTable" class="w-full">
            <tr>
              <td colspan="2">
                <strong>To</strong><br />
                <span class="font-medium">FBO Business Name: </span>${
                  proposalData.fbo_name
                }<br />
                <span class="font-medium">Contact Person Name: </span>${
                  proposalData.contact_person
                }<br />
                <span class="font-medium">Contact Person Number: </span>${
                  proposalData.contact_person
                }<br />
                <span class="font-medium">FBO Address: </span>${
                  proposalData.address.line1 + "," + proposalData.address.line2
                }<br />
                <span class="font-medium">Pin code: </span>${
                  proposalData.pincode
                }<br />
                <span class="font-medium">GST No: </span>${
                  proposalData.gst_number
                }<br />
              </td>
              <td colspan="2">
                <span class="font-medium">Proposal Number: </span>${
                  proposalData.proposal_number
                }<br />
                <span class="font-medium">Proposal Date: </span>${formattedDate}<br />
                <span class="font-medium">Format No: </span>${
                  proposalData.formatNumber
                }<br />
                <span class="font-medium">Issue Date: </span>${
                  proposalData.issueDate
                }<br />
                <span class="font-medium">Version No: </span>${
                  proposalData.versionNumber
                }<br />
              </td>
            </tr>
          </table>
        </div>
        <div class="mt-5 w-full flex justify-center">
          <table class="border-collapse w-[90%]">
            <tr>
              <th class="px-2 py-1">Outlet Name</th>
              <th class="px-2 py-1">Description</th>
              <th class="px-2 py-1">Service</th>
              <th class="px-2 py-1">Man Days</th>
              <th class="px-2 py-1">Qty</th>
              <th class="px-2 py-1">Unit Cost</th>
              <th class="px-2 py-1">Amount</th>
            </tr>
            ${outletRows}
            <tr>
              <td colspan="6" class="selected-cell border text-right w-3/4 small-cell">
                <strong>Sub Total</strong>
              </td>
              <td class="border w-1/4 selected-cell small-cell "><strong>${total}</strong></td>
            </tr>
            <tr>
              <td colspan="6" class="border text-right w-3/4 small-cell">
                <strong>CGST9 [9%]</strong>
              </td>
              <td class="border w-1/4 small-cell ">${cgst}</td>
            </tr>
            <tr>
              <td colspan="6" class="border text-right w-3/4 small-cell">
                <strong>SGST9 [9%]</strong>
              </td>
              <td class="border w-1/4 small-cell ">${sgst}</td>
            </tr>
            <tr>
              <td colspan="6" class="border selected-cell text-right w-3/4 small-cell">
                <strong>Total</strong>
              </td>
              <td class="border w-1/4 selected-cell small-cell"><strong>${overallTotal}</strong></td>
            </tr>
          </table>
        </div>
        <div class="mt-5">
          <strong class="block my-2">Auditor Conveyance Charges:</strong>
          <div class="w-full flex justify-center">
            <table class="border-collapse w-3/4">
              <tr>
                <td class="w-1/2 border px-4 py-1">Total Amount (without tax)</td>
                <td class="w-1/2 border px-4 py-1"><strong>${total}</strong></td>
              </tr>
              <tr>
                <td class="w-1/2 border px-4 py-1">CGST9 [9%]</td>
                <td class="w-1/2 border px-4 py-1">${cgst}</td>
              </tr>
              <tr>
                <td class="w-1/2 border px-4 py-1">SGST9 [9%]</td>
                <td class="w-1/2 border px-4 py-1">${sgst}</td>
              </tr>
              <tr>
                <td class="w-1/2 border px-4 py-1">
                  <strong>Total Amount (With Tax)</strong>
                </td>
                <td class="w-1/2 border px-4 py-1"> <strong>${overallTotal}</strong></td>
              </tr>
            </table>
          </div>
        </div>
         <div class="mt-5">
          <strong>Note:</strong>
          <ol class="list-inside">
            ${noteContent
              .map((line) => `<li>${line}</li>`)
              .join("")}
          </ol>
        </div>
        <div class="mt-10">
          <div class="text-center mb-4">
            <h2 class="font-bold text-sm">Address & Payment Details</h2>
          </div>
          <div class="text-center">
            <table class="border w-4/5 mx-auto">
              <tr>
                <td class="w-1/2 border p-2 align-top">
                  <strong>Company Address:</strong>
                  <div>Unavar Food Inspection and Certification Pvt Ltd.</div>
                  <div>8-2-672/1/3, 2nd Floor, Road No. 1, Banjara Hills, Hyderabad-500034</div>
                  <div>Contact: +91-1234567890</div>
                  <div>Email: info@unavarfood.com</div>
                </td>
                <td class="w-1/2 border p-2 align-top">
                  <strong>Bank Details:</strong>
                  <div>Bank Name: XYZ Bank</div>
                  <div>Account Number: 1234567890</div>
                  <div>IFSC Code: XYZ123</div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        
    </body>
    </html>
  `;

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
            <h2 className="text-xl font-semibold">View Proposal Document</h2>
            <Button type="primary" className="ml-auto" >
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
        </>
      </AdminDashboard>
    </div>
  );
};

export default ViewProposal;
