import React, { useState,useEffect ,useRef } from "react";
import { Button, message, Steps, theme } from "antd";
import BusinessDetail from "./BussinessDetail";
import OutletDetail from "./OutletDetail";
import QuestionnairesForm from "./QuestionnairesForm";

const AddClientForm = ({ newClientTitle }) => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    businessDetail: {},
    outletDetail: {},
  });

  const businessDetailRef = useRef();
  const outletDetailRef = useRef();

  // Moves to the next step
  const next = () => {
    if (current === 0) {
      // Validate Business Detail and move to the next step
      businessDetailRef.current
        ?.submit()
        .then(() => {
          setCurrent(current + 1);
        })
        .catch((error) => {
        
        });
    } else if (current === 1) {
      // Validate Outlet Detail and move to the next step
      outletDetailRef.current
        ?.submit()
        .then(() => {
          setCurrent(current + 1);
        })
        .catch((error) => {
          console.error("Error submitting Outlet Detail:", error);
          message.error("Failed to submit Outlet Detail. Please try again.");
        });
    } else {
      setCurrent(current + 1);
    }
  };

  // Moves to the previous step
  const prev = () => setCurrent(current - 1);

  // Handles the form data changes from child components
  const handleBusinessDetailChange = (data) => {
    setFormData((prev) => ({ ...prev, businessDetail: data }));
  };

  const handleOutletDetailChange = (data) => {
    setFormData((prev) => ({ ...prev, outletDetail: data }));
  };

  // Submits the form data
  const handleSubmit = async () => {
    try {
      // Submitting business details
      const businessResponse = await fetch(
        "https://your-backend-api.com/business",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData.businessDetail),
        }
      );

      if (!businessResponse.ok)
        throw new Error("Failed to submit business detail");

      const businessData = await businessResponse.json();
      const businessId = businessData.id;

      // Submitting outlet details with businessId
      const outletResponse = await fetch(
        "https://your-backend-api.com/outlet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData.outletDetail, businessId }),
        }
      );

      if (!outletResponse.ok) throw new Error("Failed to submit outlet detail");

      message.success("Data submitted successfully!");
    } catch (error) {
      console.error("Error during submission process:", error);
      message.error("An error occurred during the submission.");
    }
  };

  // Steps configuration
  const steps = [
    {
      title: "Business Detail",
      content: (
        <BusinessDetail
          ref={businessDetailRef}
          data={formData.businessDetail}
          onChange={handleBusinessDetailChange}
        />
      ),
    },
    {
      title: "Outlet Detail",
      content: (
        <OutletDetail
          ref={outletDetailRef}
          data={formData.outletDetail}
          onChange={handleOutletDetailChange}
        />
      ),
    },
    {
      title: "Questionnaires",
      content: (
        <QuestionnairesForm
          //ref={outletDetailRef}
          data={formData.outletDetail}
          //onChange={handleQuestionnariesDetailChange}
        />
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle = {
    marginTop: 16,
  };

  const stepsContainerStyle = {
    width: "50%",
    margin: "0 auto",
  };

  return (
    <>
      <div className="top-0 z-50 bg-white">
        <div className="mb-10 border shadow-bottom px-4 py-4">
          <h2 className="text-2xl font-semibold">{newClientTitle}</h2>
        </div>
      </div>

      <div style={stepsContainerStyle} >
        <Steps current={current} items={items} />
      </div>
      <div style={contentStyle}>{steps[current].content}</div>
      <div className="sticky bottom-0 z-50 bg-white w-full p-8 flex justify-start shadow-top">
        <div>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prev}>
              Previous
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default AddClientForm;
