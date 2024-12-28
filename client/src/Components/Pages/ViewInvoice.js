import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminDashboard from "../Layout/AdminDashboard";
import { Spin, Button } from "antd";
import { ToWords } from "to-words";
import moment from "moment";
import UpdateGenerateInvoiceModal from "./UpdateGenerateInvoiceModal";

const ViewInvoice = () => {
  const { invoiceId } = useParams(); // Extract invoiceId from the route
  const [invoiceData, setInvoiceData] = useState(null);
  const [zoom, setZoom] = useState(1); // State to manage zoom level
  const [noteContent, setNoteContent] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [proposalId, setProposalId] = useState();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const navigate = useNavigate();

  const fetchInvoiceData = async () => {
    try {
      // Fetch invoice data, company details, and bank details concurrently
      const [invoiceResponse, companyResponse, bankDetailsResponse] =
        await Promise.all([
          axios.get(`/api/invoice/getInvoiceById/${invoiceId}`),
          axios.get(`/api/setting/getCompanyDetail`),
          axios.get(`/api/setting/getTheBankDetails`),
        ]);

      // Log the full response to inspect the structure
      console.log("Company Response:", companyResponse);

      // Extract the necessary data
      const invoiceData = invoiceResponse.data;
      const companyProfile1 = companyResponse.data?.profile; // Extract profile from company response
      const bankDetails = bankDetailsResponse.data?.bankDetail; // Extract bank details from bank response

      console.log("This is company profile", companyProfile1); // Check if companyProfile1 is correctly populated

      // Set the states
      setProposalId(invoiceData.proposalId);
      setInvoiceData(invoiceData);
      setCompanyProfile(companyProfile1);
      setBankDetails(bankDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchNoteContent = async () => {
      try {
        const response = await axios.get(
          `/api/setting/getSetting/66c41b85dedfff785c08df21`
        );
        console.log("Fetched note content:", response.data);
        const formattedNote = response.data.invoice_note.split("\n");
        setNoteContent(formattedNote);
      } catch (error) {
        console.error("Error fetching note content:", error);
      }
    };

    fetchInvoiceData();
    fetchNoteContent();
  }, [invoiceId]); // Depend on invoiceId only

  // Calculate total, cgst, sgst, and overall total only if invoiceData is available
  let subTotal = 0;
  let outletItems = "";

  if (invoiceData && invoiceData.outlets) {
    outletItems = invoiceData.outlets
      .map((outlet) => {
        const unit_cost = parseFloat(outlet.unit_cost || 0);
        const amount = parseFloat(outlet.amount || 0);

        subTotal += amount;

        return `
    <tr>
      <td class="px-2 py-1 text-center">${outlet.outlet_name || ""}</td>
      <td class="px-2 py-1 text-center">${outlet.description || ""}</td>
      <td class="px-2 py-1 text-center">${outlet.service || ""}</td>
      <td class="px-2 py-1 text-center">${outlet.man_days || 0}</td>
      <td class="px-2 py-1 text-center">${outlet.quantity || 0}</td>
      <td class="px-2 py-1 text-center">₹${unit_cost}</td>
      <td class="px-2 py-1 text-center">₹${amount}</td>
    </tr>
  `;
      })
      .join("");
  }

  // Initialize tax variables
  let cgst = 0;
  let sgst = 0;
  let gst = 0;
  let overallTotal = 0;

  if (invoiceData && invoiceData.same_state) {
    cgst = parseFloat((subTotal * 0.09).toFixed(2)); // 9% CGST
    sgst = parseFloat((subTotal * 0.09).toFixed(2)); // 9% SGST
    overallTotal = parseFloat((subTotal + cgst + sgst).toFixed(2));
  } else {
    gst = parseFloat((subTotal * 0.18).toFixed(2)); // 18% GST
    overallTotal = parseFloat((subTotal + gst).toFixed(2));
  }

  let tax;
  if (invoiceData && invoiceData.same_state) {
    tax = `<p><span class="font-semibold">Add: CGST(9%):</span>${cgst}</p>
         <p><span class="font-semibold">Add: SGST(9%):</span>${sgst}</p>`;
  } else {
    tax = `<p><span class="font-semibold">Add: IGST:</span>${gst}</p>`;
  }

  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        // can be used to override defaults for the selected locale
        name: "Rupee",
        plural: "Rupees",
        symbol: "₹",
        fractionalUnit: {
          name: "Paisa",
          plural: "Paise",
          symbol: "",
        },
      },
    },
  });

  let words = toWords.convert(subTotal);

  const formattedDate = invoiceData
    ? moment(invoiceData.invoice_date).format("MMMM D, YYYY")
    : "";

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    fetchInvoiceData();
    setIsModalVisible(false);
  };

  if (!invoiceData) {
    return (
      <AdminDashboard>
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      </AdminDashboard>
    );
  }

  const htmlTemplate = `
    <!DOCTYPE html>
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
        }
        .container {
          background-color: #ffffff;
          padding: 10px;
          max-width: 100%;
          margin: auto;
          width: 793px;
          margin-left: auto;
          margin-right: auto;
        }
        table {
          border-collapse: collapse;
          font-size: 11px;
        }
        th {
          background-color: #edf2f7;
        }
        th,
        td {
          border: 1px solid #e2e8f0;
          padding: 4px 6px;
        }
        .header-info,
        .bill-info,
        .total-info,
        .bank-info,
        .declaration,
        .signature {
          margin-bottom: 6px;
        }
        .header-info h2,
        .bill-info h2,
        .bank-info h2,
        .declaration h2 {
          font-size: 13px;
        }
        .text-right p {
          margin: 0;
        }
        .content-box {
          position: relative;
          background-image: linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)),
            url('/logo2.png');
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
  <h2 style="font-size: 1rem; font-weight: bold; color: #13A6B8;">
  ${companyProfile?.company_name?.toUpperCase() || "Company Name"}
</h2>


    <p style="color: #13A6B8;">
      ${companyProfile?.company_address?.line1 || "Address Line 1"}, 
      ${companyProfile?.company_address?.line2 || "Address Line 2"}, 
      ${companyProfile?.company_address?.city || "City"}, 
      ${companyProfile?.company_address?.state || "State"} - 
      ${companyProfile?.company_address?.pincode || "Pincode"}
    </p>
    <p style="color: #13A6B8;">
      Tel: ${companyProfile?.contact_number || "Contact Number"} | Email: ${
    companyProfile?.email || "Email not available"
  }
    </p>
    <p style="color: #13A6B8;">
      GSTIN: ${companyProfile?.gstin || "GSTIN not available"} | PAN: ${
    companyProfile?.PAN || "PAN not available"
  }
    </p>
  </div>
          <img src="/logo2.png" alt="Your Image Alt Text" width="80" height="80" />
        </div>
        <h1 class="text-xl font-bold my-2 text-center text-gray-700">TAX INVOICE</h1>
        <div class="content-box">
          <div class="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p><span class="font-semibold">Invoice No:</span> ${
                invoiceData.invoice_number
              }</p>
              <p><span class="font-semibold">Invoice Date:</span> ${formattedDate}</p>
              <p><span class="font-semibold">Order Ref No:</span> ${
                invoiceData.proposal_number
              }</p>
              <p><span class="font-semibold">Cust. P.O. No:</span> ${
                invoiceData.Cust
              }</p>
            </div>
            <div>
              <p><span class="font-semibold">Field Executive Name:</span>${
                invoiceData.field_executive_name
              }</p>
              <p><span class="font-semibold">Team Leader Name:</span>${
                invoiceData.team_leader_name
              }</p>
            </div>
          </div>
          <div class="bill-info mb-2">
            <h2 class="text-md font-semibold text-gray-700">Bill to Party</h2>
            <p><span class="font-semibold">Name:</span> ${
              invoiceData.fbo_name
            }</p>
          <p><span class="font-semibold">Address:</span> ${
            invoiceData.address.line1
          }${
    invoiceData.address.line2 ? `, ${invoiceData.address.line2}` : ""
  }</p>
            <p><span class="font-semibold">GSTIN:</span> ${
              invoiceData.gst_number
            }</p>
            <p><span class="font-semibold">State (Place of Supply):</span> ${
              invoiceData.place_of_supply
            }</p>
            <p><span class="font-semibold">Pincode Code:</span> ${
              invoiceData.pincode
            }</p>
          </div>
          <div class="mb-2">
            <p><span class="font-semibold">SAC:</span> 998399 (18%)</p>
          </div>
          <table class="table-auto w-full my-6">
            <thead>
              <tr>
                <th class="px-2 py-1 text-center">Outlet Name</th>
                <th class="px-2 py-1 text-center">Service</th>
                <th class="px-2 py-1 text-center">Criteria</th>
                <th class="px-2 py-1 text-center">Man Days</th>
                <th class="px-2 py-1 text-center">Qty</th>
                <th class="px-2 py-1 text-center">Unit Cost</th>
                <th class="px-2 py-1 text-center">Amount</th>
              </tr>
            </thead>
            <tbody>
           ${outletItems}
              <tr>
                <td class="px-2 py-1 font-bold text-right" colspan="6">Sub Total</td>
                <td class="px-2 py-1 font-bold text-center ">
                 ₹${subTotal}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="total-info mb-2">
            <p class="font-semibold text-gray-700 mb-4">
              Total Invoice amount in words:
              <span class="font-normal">${words}</span>
            </p>
            <p><span class="font-semibold">Total Amount before Tax:</span>
              ${subTotal}
            </p>
           ${tax}
            <p><span class="font-semibold">Total Amount after Tax:</span>
              ${overallTotal}
            </p>
            <p><span class="font-semibold">Gst On Reverse Charge:</span>${
              invoiceData.Gst
            }</p>
          </div>
          <div class="bank-info my-2">
  <h2 class="text-md font-semibold text-gray-700">Bank Account Details</h2>
  <p><span class="font-semibold">Account Holder's Name:</span> ${
    bankDetails?.account_holder_name || "Account Holder's Name"
  }</p>
  <p><span class="font-semibold">Bank Name:</span> ${
    bankDetails?.bank_name || "Bank Name"
  }</p>
  <p><span class="font-semibold">Bank Branch:</span> ${
    bankDetails?.branch || "Bank Branch"
  }</p>
  <p><span class="font-semibold">IFSC Code:</span> ${
    bankDetails?.ifsc_code || "IFSC Code"
  }</p>
  <p><span class="font-semibold">Account No:</span> ${
    bankDetails?.account_number || "Account Number"
  }</p>
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
      </div>
    </body>
    </html>
  `;

  return (
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
            onClick={() => setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5))}
            className="px-4 py-2 bg-gray-200 border border-gray-400 rounded"
          >
            -
          </button>
          <span className="text-lg">Zoom: {Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((prevZoom) => Math.min(prevZoom + 0.1, 1.1))}
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
          proposalId={proposalId}
          invoiceId={invoiceId}
        />
      </>
    </AdminDashboard>
  );
};

export default ViewInvoice;
