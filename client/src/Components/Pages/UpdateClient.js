import React, { useState, useRef, useEffect } from "react";
import { Button, Steps, message, Spin } from "antd";
import UpdateBusinessDetail from "./UpdateBussinessDetail";
import UpdateOutlet from "./UpdateOutlet";
import UpdateQuestionnairesForm from "./UpdateQuestionnairesForm";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const { Step } = Steps;

const UpdateClient = ({ newClientTitle }) => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessDetail: {},
    UpdateOutlet: { items: [] },
    questionnairesDetail: {},
  });
  const [businessId, setBusinessId] = useState(null);

  const businessDetailRef = useRef();
  const UpdateOutletRef = useRef();
  const questionnairesFormRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const scrollableContainer = document.querySelector(".scrollable-container");
    if (scrollableContainer) {
      scrollableContainer.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [current]);



  const prev = () => setCurrent(current - 1);



  const steps = [
    {
      title: "Business Detail",
      content: (
        <UpdateBusinessDetail
          ref={businessDetailRef}
          loading={loading}
          setLoading={setLoading}
          setBusinessId={setBusinessId}
        />
      ),
    },
    {
      title: "Outlet Detail",
      content: (
        <UpdateOutlet
          ref={UpdateOutlet}
          data={formData.UpdateOutlet}
          onChange={(data) =>
            setFormData((prev) => ({ ...prev, UpdateOutlet: data }))
          }
        />
      ),
    },
    {
      title: "Questionnaires",
      content: (
        <UpdateQuestionnairesForm
          ref={questionnairesFormRef}
          data={formData.questionnairesDetail}
          onChange={(data) =>
            setFormData((prev) => ({ ...prev, questionnairesDetail: data }))
          }
        />
      ),
    },
  ];

  const handleStepChange = (newStep) => {
    setCurrent(newStep);
  };


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
        <div className="mb-10 border shadow-bottom px-4 py-4 flex items-center">
        
            <span
              onClick={() => navigate("/client-profile")}
              className="cursor-pointer text-3xl mr-4"
            >
              ←
            </span>

          <h2 className="text-2xl font-semibold">{newClientTitle}</h2>
        </div>
      </div>

      <div style={stepsContainerStyle}>
        <Steps current={current} items={items} onChange={handleStepChange} />
      </div>
      <div style={contentStyle}>
        {loading ? <Spin /> : steps[current].content}
      </div>
      {/* <div className="sticky bottom-0 z-50 bg-white w-full p-8 flex justify-start shadow-top">
        <div>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next} loading={loading}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={next} loading={loading}>
              Submit
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{ margin: "0 8px" }}
              onClick={prev}
              loading={loading}
            >
              Previous
            </Button>
          )}
        </div>
      </div> */}
    </>
  );
};

export default UpdateClient;
