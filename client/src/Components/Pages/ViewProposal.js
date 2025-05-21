import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminDashboard from "../Layout/AdminDashboard";
import moment from "moment";
import { Spin, Button } from "antd";
import UpdateGenerateProposalModal from "./UpdateGenrateProposalModal";

import "../css/view.css";

const ViewProposal = () => {
  const { proposalId } = useParams(); // Extract proposalId from the route
  const [proposalData, setProposalData] = useState(null);
  const [zoom, setZoom] = useState(1); // State to manage zoom level
  const [noteContent, setNoteContent] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);

  const navigate = useNavigate();

  const fetchProposalData = async () => {
    try {
      // Fetch proposal, company, and bank details concurrently
      const [proposalResponse, companyResponse, bankDetailsResponse] =
        await Promise.all([
          axios.get(`/api/proposal/getProposalById/${proposalId}`),
          axios.get(`/api/setting/getCompanyDetail`),
          axios.get(`/api/setting/getTheBankDetails`),
        ]);

      // Extract the necessary data
      const proposalData = proposalResponse.data;
      const companyProfile = companyResponse.data?.profile; // Extract profile from company response
      const bankDetails = bankDetailsResponse.data?.bankDetail; // Extract bankDetail from bank details response

      // Set the data in respective state variables
      setProposalData(proposalData);
      setCompanyProfile(companyProfile);
      setBankDetails(bankDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchNoteContent = async () => {
      try {
        const response = await axios.get(
          `/api/setting/getSetting`
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
          <Spin />
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
      let postfix = "";
      switch (outlet.type_of_industry) {
        case "Transportation":
          postfix = "VH";
          break;
        case "Catering":
          postfix = "FH";
          break;
        case "Trade and Retail":
          postfix = "Sq ft";
          break;
        case "Manufacturing":
          postfix = "PD/Line";
          break;
        default:
          postfix = ""; // or any default value
      }

      const outletName = outlet.outlet_name || "";
      let service = outlet.unit ? `${outlet.unit} ${postfix}` : "";
      let manDays = outlet.man_days?.$numberDouble || outlet.man_days || 0;
      const quantity = outlet.quantity?.$numberInt || outlet.quantity || 0;
      const unitCost = outlet.unit_cost?.$numberInt || outlet.unit_cost || 0;
      const amount = outlet.amount?.$numberInt || outlet.amount || 0;

      if (outletName === "Others") {
        service = "N/A";
        manDays = "N/A";
      }

      return `
      <tr>
        <td class="px-2 py-1 text-center">${outletName}</td>
        <td class="px-2 py-1 text-center">${outlet.description || ""}</td>
        <td class="px-2 py-1 text-center">${service}</td>
        <td class="px-2 py-1 text-center">${manDays}</td>
        <td class="px-2 py-1 text-center">${quantity}</td>
        <td class="px-2 py-1 text-center">${unitCost}</td>
        <td class="px-2 py-1 text-center">${amount}</td>
      </tr>
    `;
    })
    .join("");

  let total = 0;
  proposalData.outlets.forEach((outlet) => {
    total += parseFloat(outlet.amount?.$numberInt || outlet.amount || 0);
  });

  // Initialize tax variables
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  let overallTotal = 0;

  if (proposalData.same_state) {
    cgst = parseFloat((total * 0.09).toFixed(2)); // 9% CGST
    sgst = parseFloat((total * 0.09).toFixed(2)); // 9% SGST
    overallTotal = parseFloat((total + cgst + sgst).toFixed(2));
  } else {
    igst = parseFloat((total * 0.18).toFixed(2)); // 18% GST
    overallTotal = parseFloat((total + igst).toFixed(2));
  }

  // Tax details to be displayed in the table
  const tax = proposalData.same_state
    ? `
    <tr>
      <td colspan="6" class="border text-right w-3/4 small-cell">
        <strong>CGST [9%]</strong>
      </td>
      <td class="border w-1/4 small-cell text-center"><strong>₹${cgst}</strong></td>
    </tr>
    <tr>
      <td colspan="6" class="border text-right w-3/4 small-cell">
        <strong>SGST [9%]</strong>
      </td>
      <td class="border w-1/4 small-cell text-center"><strong>₹${sgst}</strong></td>
    </tr>
  `
    : `
    <tr>
      <td colspan="6" class="border text-right w-3/4 small-cell">
        <strong>IGST [18%]</strong>
      </td>
      <td class="border w-1/4 small-cell text-center"><strong>₹${igst}</strong></td>
    </tr>
  `;

  const tax2 = proposalData.same_state
    ? `  <tr>
                <td class="w-1/2 border px-4 py-1"><strong>CGST9 [9%]</strong></td>
                <td class="w-1/2 border px-4 py-1"><strong class="font-medium" >₹${cgst}</strong></td>
              </tr>
              <tr>
                <td class="w-1/2 border px-4 py-1"><strong>SGST9 [9%]</strong></td>
                <td class="w-1/2 border px-4 py-1"><strong  class="font-medium">₹${sgst}</strong></td>
              </tr>
              <tr>`
    : ` <tr>
                <td class="w-1/2 border px-4 py-1"><strong>IGST [18%]</strong></td>
                <td class="w-1/2 border px-4 py-1"><strong  class="font-medium"><strong>₹${igst}</strong></td>
              </tr>`;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    fetchProposalData();

    setIsModalVisible(false);
  };

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

         .content-box {
            position: relative;
            background-image:
                linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)),
                url('/logo2.png');
          
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center center;
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
          background-color: rgba(242, 242, 242, 0.5) !important;
        }
        .small-cell {
          padding: 4px; /* Adjust padding */
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
            <img src="/logo2.png" alt="Your Image Alt Text" width="80" height="80" />
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-800">
              Unavar Food Inspection and Certification Private Limited
            </h1>
          </div>
        </div>
        <div class="content-box">
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
                  proposalData.phone
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
          <table class="border-collapse w-full">
            <tr>
              <th class="px-2 py-1 text-center">Outlet Name</th>
              <th class="px-2 py-1 text-center">Service</th>
              <th class="px-2 py-1 text-center">Criteria</th>
              <th class="px-2 py-1 text-center">Man Days</th>
              <th class="px-2 py-1 text-center">Qty</th>
              <th class="px-2 py-1 text-center">Unit Cost</th>
              <th class="px-2 py-1 text-center">Amount</th>
            </tr>
            ${outletRows}
            <tr>
              <td colspan="6" class="selected-cell border text-right w-3/4 small-cell">
                <strong>Sub Total</strong>
              </td>
              <td class="border w-1/4 selected-cell small-cell text-center "><strong>₹${total}</strong></td>
            </tr>
           ${tax}
              <td colspan="6" class="border selected-cell text-right w-3/4 small-cell">
                <strong>Total</strong>
              </td>
              <td class="border w-1/4 selected-cell small-cell text-center"><strong>₹${overallTotal}</strong></td>
            </tr>
          </table>
        </div>
        <div class="mt-5">
          <strong class="block my-2">Auditor Conveyance Charges:</strong>
          <div class="w-full flex justify-center">
            <table class="border-collapse w-3/4">
              <tr>
                <td class="w-1/2 border px-4 py-1"><strong>Total Amount (without tax)</strong></td>
                <td class="w-1/2 border px-4 py-1"><strong>₹${total}</strong></td>
              </tr>
             ${tax2}
                <td class="w-1/2 border px-4 py-1">
                  <strong>Total Amount (With Tax)</strong>
                </td>
                <td class="w-1/2 border px-4 py-1"> <strong>₹${overallTotal}</strong></td>
              </tr>
            </table>
          </div>
        </div>
         <div class="mt-5">
          <strong>Note:</strong>
          <ol class="list-inside">
            ${noteContent.map((line) => `<li>${line}</li>`).join("")}
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
          <strong class="font-medium">Company Address:</strong>
      
          <div>
            ${companyProfile?.company_address?.line1 || ""}, 
            ${companyProfile?.company_address?.line2 || ""}, 
            ${companyProfile?.company_address?.city || ""}, 
            ${companyProfile?.company_address?.state || ""} - 
            ${companyProfile?.company_address?.pincode || ""}
          </div>
         <div>
  <strong class="font-medium">Contact:</strong> ${
    companyProfile?.contact_number || ""
  }
</div>
<div>
  <strong class="font-medium">Email:</strong> ${companyProfile?.email || ""}
</div>

        </td>
        <td class="w-1/2 border p-2 align-top">
          <strong class="font-medium">Bank Details:</strong>
          <div ><strong class="font-medium">Bank Name:</strong> ${bankDetails?.bank_name || "N/A"}</div>
          <div><strong class="font-medium">Account Number:</strong> ${bankDetails?.account_number || "N/A"}</div>
          <div><strong class="font-medium">IFSC Code:</strong> ${bankDetails?.ifsc_code || "N/A"}</div>
        </td>
      </tr>
    </table>
  </div>
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
          <UpdateGenerateProposalModal
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            proposalId={proposalId}
          />
        </>
      </AdminDashboard>
    </div>
  );
};

export default ViewProposal;
