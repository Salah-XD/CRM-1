import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminDashboard from "../Layout/AdminDashboard";
import moment from "moment";
import { Spin, Button } from "antd";
import UpdateGenerateAgreementModal from "./UpdateGenerateAgreementModal";

import "../css/view.css";

const ViewAgreement = () => {
  const { agreementId } = useParams(); // Extract agreementId from the route
  const [agreementData, setagreementData] = useState(null);
  const [zoom, setZoom] = useState(1); // State to manage zoom level
  const [noteContent, setNoteContent] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [proposalId,setProposalId]=useState(false);

  const navigate = useNavigate();

  const fetch = async () => {
    try {
      const response = await axios.get(
        `/api/agreement/getAgreementById/${agreementId}`

      );
      setProposalId(response.data.proposalId);
      setagreementData(response.data);
    } catch (error) {
      console.error("Error fetching agreement data:", error);
    }
  };

  useEffect(() => {
 

    const fetchNoteContent = async () => {
      try {
        const response = await axios.get(
          `/api/setting/getSetting/66c41b85dedfff785c08df21`
        );
        console.log("Fetched note content:", response.data);
        const formattedNote = response.data.agreement_note.split("\n");
        setNoteContent(formattedNote);
      } catch (error) {
        console.error("Error fetching note content:", error);
      }
    };

    fetch();
    fetchNoteContent();
  }, [agreementId]);

  const formattedFromDate = agreementData
    ? moment(agreementData.from_date).format("DD/MM/YYYY")
    : "";
  const formattedToDate = agreementData
    ? moment(agreementData.to_date).format("DD/MM/YYYY")
    : "";

  if (!agreementData) {
    return (
      <AdminDashboard>
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      </AdminDashboard>
    );
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    fetch();
    setIsModalVisible(false);
    
  };

  const handleCancel = () => {
    fetch();
    setIsModalVisible(false);
  };

  // Inject data into HTML template
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Agreement</title>
    <!-- Tailwind CSS -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        @page {
            size: A4;
            margin: 0;
        }

        html {
            -webkit-print-color-adjust: exact;
        }

        .container {
            width: 793px;
            /* A4 width in pixels */
            margin-left: auto;
            margin-right: auto;
        }

        .a4 {
            border: 2px solid black;
            /* Add border to a4 class */
        }

        .a4 img {
            width: 100%;
            height: auto;
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
/* 
        body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            background-image:
                linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)),
                url("data:image/png;base64,{{imageData}}");
            background-repeat: repeat;
            background-position: center;
            background-attachment: fixed;
            background-size: 250mm 300mm;

        } */




        .page-break-before {
            page-break-before: always;
        }

        .text-transparent-bg {
            background-color: rgba(255, 255, 255, 0.6);
            /* Semi-transparent background */
            color: rgba(0, 0, 0, 0.8);
            /* Slightly transparent text color */
        }
    </style>
</head>

<body class="bg-white text-xs"> <!-- Change font size for body -->
    <div class="container bg-white rounded-lg p-4 text-transparent-bg">
        <div class="flex p-2 header items-center border mb-4">
            <div class="w-1/5">
                <!-- Include this placeholder where you want the image to appear -->
               <img src="/logo2.png" alt="Your Image Alt Text" width="80" height="80" />
            </div>
            <div>
                <h1 class="text-lg font-bold text-gray-800">
                    Unavar Food Inspection and Certification Private Limited
                </h1>
            </div>
        </div>


    
        <div class="agreement-document w-full mb-4">
            <!-- Main Heading -->
            <h1 class="text-xl font-bold mb-6 text-center"> Agreement</h1>

            <!-- Agreement Terms -->
            <div class="agreement-terms px-4">
            <div class="content-box">
                <ol class="list-decimal list-inside">


                    <p class="ml-4 my-4">
                        This Services Agreement (“Agreement”) is made on this day of <strong>${formattedFromDate}</strong> by and
                        between:<br>
                        <strong>M/s. UNAVAR FOOD INSPECTION AND CERTIFICATION PRIVATE LIMITED</strong> (“Hygiene Rating
                        Audit Agency”), with its principal place of business at <strong>Flat No. F1, First Floor, Door
                            No. 519, MMIlla, MKN Road, Adambakkam Village, Alandur, Chennai – 600016</strong>.<br>
                        And:<br>
                        <strong>${agreementData.fbo_name}</strong>, with respect to the <strong>Food Safety Services at the following
                            address: ${agreementData.address}</strong>, hereinafter referred to as <strong>COMPANY</strong>.<br>
                        WHEREBY IT IS AGREED AS FOLLOWS:
                    </p>


                    <!-- Existing Terms -->
                    <li class="mb-4">
                        <strong>Scope of Services.</strong>
                        <p class="ml-4">
                            The <strong>Audit Agency</strong> shall provide services of <strong>Hygiene Rating
                                Audit</strong> to the company which is made part of this agreement. The audit agency
                            will provide the services using trained and qualified audit personnel only under adequate
                            supervision. The audit agency warrants that it will perform the service in a good, prompt,
                            and professional manner with reasonable care and in compliance with auditing standards,
                            accreditation, and statutory requirements. The services are undertaken with maximum safety
                            precautions and aim to meet the highest standards of quality.
                        </p>
                    </li>
                    <li class="mb-4">
                        <strong>Term and Termination.</strong>
                        <p class="ml-4">
                            The term of this Agreement shall be for a period of <strong>${agreementData.period}</strong> months
                            starting from
                            <strong> ${formattedFromDate}</strong> to
                            <strong>${formattedToDate}</strong>. The parties may thereafter renew the term of this Agreement
                            upon mutual written
                            agreement. The Company may terminate this Agreement at any time during the term without any
                            prior written notice, without cause, without any termination fee, or any other cost, charge,
                            or expense of any kind or nature. In the event either party breaches a provision of this
                            Agreement, the non-defaulting party may terminate this Agreement with written notice. If the
                            impartiality policy of the auditing agency is compromised, then the agreement will be
                            terminated without prior notice. This right of termination is in addition to whatever rights
                            the non-defaulting party may have herein, at law, or in equity.
                        </p>
                    </li>
                    <!-- New Term -->
                    <li class="mb-4">
                        <strong>Fee for Services, Payment, Limitation of Liability.</strong>
                        <p class="ml-4">
                            The audit fees per outlet are decided as <strong>Rs. ${agreementData.total_cost}</strong> plus tax for
                            <strong>
                                ${agreementData.no_of_outlets}
                            </strong>
                            outlet. This fee is
                            determined upon acceptance of the proposal or work order issued by the client. The audit
                            agency will submit an invoice prior to service execution as per the agreed amount. The Audit
                            Agency agrees to provide a GST invoice as per government requirements, and it will be filed
                            in the GST portal. The invoice will be paid by the Company within 7 working days of receipt.
                            Services will be executed once payment has been made. If there is a delay in payment beyond
                            45 days from the date of invoice, the Audit Agency will charge simple interest at 24% on the
                            outstanding amount, and the invoice shall be paid along with the interest. The audit agency
                            will re-submit a proposal for the audit to be conducted, as any proposal is valid only for
                            30 days from the date it is created. The audit agency agrees that it will be solely
                            responsible for the payment of all taxes related to the Services. The company shall deduct
                            TDS as per legal norms.
                        </p>

                        <p class="ml-4 mt-4">
                            The audit scores or ratings will be provided as per actuals observed at the time of the
                            audit, and payment will not be withheld irrespective of the ratings provided to the FBO. If
                            an impartiality risk assessment indicates that payment release will be based on audit
                            results or ratings, such tenders or clients will not be accepted for audit.
                        </p>
                    </li>
                    <li class="mb-4">
                        <strong>Governing Law Arbitration.</strong>
                        <p class="ml-4">
                            This Agreement shall be construed under and governed by the laws of India. Notwithstanding
                            anythingto the contrary herein, either party may seek injunctive or equitable relief
                            (including, without limitation, restraining orders and preliminary injunctions) in any court
                            of competent jurisdiction.
                        </p>


                    </li>
                    <li class="mb-4">
                        <strong>General Terms and Conditions.</strong>
                        <p class="ml-4">
                            The parties agree that the terms and conditions set forth in this document are expressly
                            part of this
                            Agreement, are incorporated herein by reference and shall apply to this Agreement. Internet
                            facilities is
                            required to conduct the audit on site. If the FBO fail to provide the internet facility the
                            audit report will
                            update the HRA website after the audit is completed wherever the net facility is available
                            where the
                            onsite and off-site is available. The audit agency will capture photo evidence. The HRA will
                            identifythe
                            aspects that could be considered as misleading and authorized as relevant to be hygiene
                            rating scheme, HRA will terminate the HR audit and certificate. The audit agreement is made
                            as for FSSAI HRguidance
                            scheme.
                        </p>


                    </li></div>
                    <div class="page-break-before content-box mt-12">

                        <li class="mb-4">
                            <strong>Impartiality.</strong>
                            <p class="ml-4">
                                The audit agency shall act impartially, and its policies and procedures for
                                certification of
                                persons shall
                                be fair among all FBO’s and shall not restrict certification on the grounds of undue
                                financial or other
                                limiting conditions. The audit agency shall be responsible for the impartiality of its
                                certification andinspection activities and shall not allow commercial, financial or
                                other
                                pressures to compromise
                                impartiality. The corporate policies and practices ensure that the highest standards of
                                integrity are
                                applied to all certification and inspection body activities. The management system has
                                the
                                necessaryprocedures, safeguards and tools to ensure that these policies are strictly
                                upheld
                                and enforced. The audit
                                service will not affect the trade associate with the clients and the quality of the
                                audit
                                will not be basedon the trade associate with the clients.
                            </p>


                        </li>
                        <li class="mb-4">
                            <strong>Confidentiality</strong>
                            <p class="ml-4">
                                This Confidentiality Policy documents the confidentiality and non – disclosure duties
                                andobligations of the employees and personnel of <strong>FOOD INSPECTION AND
                                    CERTIFICATION
                                    PRIVATE LIMITED</strong> . All information received by or available to <strong>
                                    UNAVAR
                                    FOOD INSPECTION AND CERTIFICATION PRIVATE LIMITED</strong>, staff, auditors,
                                contractors
                                or committee members (in whatever format) received in conducting audit activities, or
                                during
                                other
                                certification activities, or during any dealings with an organization for any other
                                reason
                                shall be regardedas strictly confidential and shall not be divulged to any 3rd party
                                without
                                the express permission of the
                                organization or individual concerned. All records will be retained in a secure
                                manner,only
                                accessible toauthorized staff via either paper records or password controlled electronic
                                records. Contractors will be
                                limited to accessing information produced by them in conducting an audit. Recordswill
                                only
                                be made
                                available to organizations who can demonstrate a legitimate (and legal) right to
                                viewthose
                                records andspecifically to Accreditation Bodies. All staff, auditors, contractors, SME
                                and
                                other members will be
                                required to agree to <strong>UNAVAR FOOD INSPECTION AND CERTIFICATION PRIVATE
                                    LIMITED</strong>, confidentiality policy and sign a confidentiality agreement.
                                Contractors will also sign anagreement which also contains the responsibility to
                                maintain
                                confidentiality.
                            </p>


                        </li>

                
          


            <div class="agreement-document w-full mb-4">
                <!-- Main Heading -->
                <h1 class="text-lg  font-bold my-4 underline ">GENERAL INTRUCTIONS</h1>

                <p class="ml-6 mb-4">On Signing the Above, the Company Ensures the Following in Terms of the Audit
                    Execution:</p>
                <ol class="ml-6">
                    <li class="mb-4">
                        <strong>a)</strong> The FE’s have to fulfill the audit requirements as specified in the document
                        “Hygiene Rating Scheme,” audit scheme and process requirements as specified in the documents
                        “Hygiene Rating Scheme – Audit Process,” and any changes communicated by the HRAA to the FE’s.
                    </li>
                    <li class="mb-4">
                        <strong>b)</strong> Makes all necessary arrangements for conducting the audit, including
                        providing documents to be audited, access to all processes and areas, records, and personnel for
                        the audit.
                    </li>
                    <li class="mb-4">
                        <strong>c)</strong> Wherever necessary, permits the presence of QCI observers, trainee
                        auditors/assessors, or shadow auditors to be a part of the audit. The accompanying auditor will
                        observe, witness, and record the information, while the lead auditor will conduct the audit.
                    </li>
                    <li class="mb-4">
                        <strong>d)</strong> Wherever necessary, permits the presence of other observers, trainee
                        auditors, or shadow auditors from the organization. The accompanying auditor will observe,
                        witness, and record the information, while the lead auditor will conduct the audit.
                    </li>
                    <li class="mb-4">
                        <strong>e)</strong> When the audit scheme introduces new or revised requirements in audit
                        criteria or process that affect the applicants and certified organizations, the food
                        establishments shall implement the changes in the system.
                    </li>
                    <li class="mb-4">
                        <strong>f)</strong> The HRAA shall document clear instructions regarding providing information
                        about audit status to the FBO.
                    </li>
                    <li class="mb-4">
                        <strong>g)</strong> Any misleading or unauthorized information given by the FBO will lead to
                        legal implications.
                    </li>
                    <li class="mb-4">
                        <strong>h)</strong> The HRAA shall notify and communicate any changes in fees to its clients,
                        including applicants and FEs already rated under the hygiene rating scheme, for their
                        acceptance.
                    </li>
                    <li class="mb-4">
                        <strong>i)</strong> The FEs shall inform the HRAA during the contracted period, without delay,
                        in the event of any of the following:
                        <ol class="  ml-6">
                            <li class="mb-4">
                                <strong>i. </strong> Changes and/or modifications of premises.
                            </li>
                            <li class="mb-4">
                                <strong>ii. </strong> Major changes in internal control measures.
                            </li>
                            <li class="mb-4">
                                <strong>iii. </strong> Major changes in the system that could affect implementing
                                prerequisites such as Good Manufacturing Practices (GMP) and Good Hygienic Practices
                                (GHP) as per Schedule IV of FSS (Licensing & Registration) Regulations, 2011, and
                                amendments thereto of FSSAI.
                            </li>
                        </ol>
                    </li>
                </ol>

            </div>
                    </div>
            <div class="page-break-before content-box mt-6">

                <strong>The Audit Agency Ensures:</strong>
                <ol class=" ml-6">
                    <li class="mb-4">
                        <strong>a)</strong> The audit status is clearly communicated, and the right information is given
                        to the FBO.
                    </li>
                    <li class="mb-4">
                        <strong>b)</strong> The audit is executed as per the audit checklist and methodology of the
                        Hygiene Rating Scheme, and necessary evidence is obtained.
                    </li>
                    <li class="mb-4">
                        <strong>c)</strong> The reports are sent on time, and the FBO is kept well informed.
                    </li>
                    <li class="mb-4">
                        <strong>d)</strong> During the contracted period, if there is a major change in the system that
                        could directly threaten FSMS plans, it should be communicated to FSSAI immediately.
                    </li>
                    <li class="mb-4">
                        <strong>e)</strong> Any misleading or unauthorized information given to the FBO will be
                        immediately addressed by the SME.
                    </li>
                    <li class="mb-4">
                        <strong>f)</strong> The FEs shall respond with corrective actions for non-conformances to the
                        HRAA & FSSAI within 24 hours of conducting the audits in case of major NCs.
                    </li>
                </ol>
          


            <div class="agreement-document w-full mb-4">
                <!-- Main Heading -->
                <h1 class="text-lg  font-bold mb-6 underline ">GENERAL TERMS AND CONDITIONS OF THE AGREEMENT ASSIGNMENT
                </h1>

                <div class="agreement-document w-full mb-4">
                    <!-- New Section -->
                    <div class="px-4">
                        <h2 class=" font-semibold mb-4">ASSIGNMENT</h2>
                        <p class="mb-4">
                            Audit Agency shall not assign this Agreement or any part hereof without the prior written
                            consent of Company Manager. The Company may assign this Agreement without the prior written
                            consent of Audit Agency. This Agreement shall inure to the benefit of the parties and
                            permitted
                            successors and assigns.
                        </p>
                        <h2 class=" font-semibold mb-4">LANGUAGE; ENTIRE AGREEMENT; AMENDMENT; WAIVER; PARTIAL
                            INVALIDITY</h2>
                        <p class="mb-4">
                            The parties acknowledge that this Agreement has been negotiated, concluded, and executed in
                            the
                            English language. In the event a translation is prepared of this Agreement in whole or in
                            part
                            for any purpose, the parties agree that the English language version shall control and be
                            determinative as to the purpose and intent of any provision of this Agreement. This
                            Agreement
                            sets out the entire agreement between the parties with respect to the subject matter herein
                            and
                            supersedes all prior agreements and understandings, both oral and written, in connection
                            with
                            such subject matter. No amendment to or modification of or waiver to this Agreement shall be
                            binding unless made in writing and signed by each of the parties. The parties agree that
                            execution by electronic signature shall have the same force and effect as execution by
                            manual
                            signature. Neither party's failure to insist on performance of any of the terms and
                            conditions
                            herein, exercise any right or privilege granted hereunder or enforce its rights in the event
                            of
                            a breach by the other party or any course of dealing or performance shall constitute a
                            waiver of
                            any other right or privilege, whether of the same or similar type. If any part of this
                            Agreement
                            is determined to be invalid or illegal by any court or agency of competent jurisdiction,
                            then
                            that part shall be limited or curtailed to the extent necessary to make such provision
                            valid,
                            and all other remaining terms of this Agreement shall remain in full force and effect.
                        </p>
                        <h2 class=" font-semibold mb-4">NOTICES</h2>
                        <p class="mb-4">
                            Any notice under this Agreement shall be in writing, in English, and delivered by personal
                            delivery or international courier service with package tracking capability and shall be
                            deemed
                            given upon personal delivery or 3 working days after deposit with the courier service.
                            Notices
                            shall be sent to each party’s respective addresses as set out in the Preamble to this
                            Agreement,
                            at the registered address of a party, or such address as a party may notify to the other in
                            writing. Typical day-to-day communications, including the placing of orders by Company, and
                            the
                            sending of invoices by Audit Agency, may be sent either by email or by hard copy; however,
                            no
                            notice of breach or termination sent by either party by email will be considered to be
                            effective
                            for any purpose under this Agreement.
                        </p>
                        <h2 class=" font-semibold mb-4">STATUS OF RELATIONSHIP; THIRD PARTY RIGHTS</h2>
                        <p class="mb-4">
                            Audit Agency is an independent Audit Agency and all persons employed to furnish the Services
                            are
                            employees of Audit Agency and not of Company. Audit Agency shall be solely responsible to
                            comply
                            with all applicable laws, including without limitation, those laws affecting its employment
                            status as an independent Audit Agency providing Services to the Company. Neither party nor
                            its
                            agents, employees or representatives shall have any authority to bind the other in any
                            contract
                            with any third party. The parties agree that a person who is not a party to this Agreement
                            shall
                            not have any rights to enforce any term of this Agreement.
                        </p>
</div>
</div>
</div>
</div>
                        <div class="page-break-before  content-box mt-6">


                            <h2 class="  ml-6 font-semibold mb-4">CONFIDENTIALITY</h2>
                            <p class=" ml-6 mb-4">
                                The terms of this Agreement are confidential, and Audit Agency and Company shall use
                                reasonable
                                efforts to ensure that the terms/information/data are not disclosed to any third party
                                without
                                the prior
                                written consent of the other party, except that Company is permitted to share this
                                Agreement
                                with the
                                owner of the Company. Audit Agency and Company agree that neither will at any time
                                disclose to
                                anyperson or use for its own benefit or the benefit of anyone, the other party’s
                                Confidential
                                Informationwithout the prior express written consent of the other party. Audit Agency
                                and
                                Company shall ensure
                                that all employees to whom the other party’s Confidential Information is disclosed take
                                reasonable
                                precautions to safeguard the confidential status of the other party’s Confidential
                                Information.
                                "Confidential Information" shall mean any non-public information of Company Manager or
                                Audit
                                Agency that is designated as confidential or proprietary, that the other party knew or
                                reasonably shouldhave known was confidential or proprietary, or that derives independent
                                value
                                from not being generallyknown to the public.
                            </p>
                            <h2 class="ml-6 font-semibold mb-4">HEADINGS; COUNTERPARTS</h2>
                            <p class="mb-4 ml-6">
                                The headings used in this Agreement are inserted only as a matter of convenience and for
                                reference andin no way define, limit or describe neither the scope of this Agreement nor
                                the
                                intent of any provisionthereof. This Agreement may be executed in any number of
                                counterparts and
                                by facsimile, each of
                                which, when executed and delivered, will be deemed to be an original and all of which,
                                when
                                takentogether, will be deemed to be but one and the same agreement. The parties agree
                                that
                                execution byelectronic signature shall have the same force and effect as execution by
                                manual
                                signature. IN WITNESS WHEREOF, the parties hereto shall execute this Services Agreement
                                the day
                                and year
                                first above written.
                            </p>
                            <p class="mb-4 ml-6">
                                Signed for and on behalf of:
                            </p>

                            <h2 class=" font-semibold mb-4 ml-6">UNAVAR FOOD INSPECTION AND CERTIFICATION Private Limited
                                (Audit Agency)</h2>


                            <h2 class=" font-semibold mb-4 ml-6">____________________</h2>

                            <h2 class=" mb-4 ml-6">Name: Mr. Vivekanand C</h2>
                            <h2 class=" mb-4 ml-6 ">Title: Executive Director</h2>

                            <h2 class=" mb-8 ml-6 ">Signed for and on behalf of (“The Company/Company Owner”) as
                                for…………………………withrespect
                                to the</h2>

                            <h2 class=" mb-4 ml-6">____________________________</h2>

                            <h2 class=" mb-4 ml-6 ">Name:Title</h2>


                        </div>
                    </div>
</div>
                </div>
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
            <h2 className="text-xl font-semibold">View Agreement Document</h2>
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
          <UpdateGenerateAgreementModal
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            agreementIds={agreementId}
            proposalId={proposalId}
          />
        </>
      </AdminDashboard>
    </div>
  );
};

export default ViewAgreement;
