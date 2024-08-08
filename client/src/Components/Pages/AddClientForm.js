import React, { useState, useRef,useEffect} from "react";
import { Button, message, Steps, theme } from "antd";
import BusinessDetail from "./BussinessDetail";
import OutletDetail from "./OutletDetail";
import QuestionnairesForm from "./QuestionnairesForm";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

const AddClientForm = ({ newClientTitle }) => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    businessDetail: {},
    outletDetail: { items: [] },
    questionnairesDetail: {},
  });



  const businessDetailRef = useRef();
  const outletDetailRef = useRef();
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


  const next = () => {
    if (current === 0) {
      businessDetailRef.current
        ?.submit()
        .then(() => {
          setCurrent(current + 1);
        })
        .catch((error) => {
          // console.error("Error submitting Business Detail:", error);
          // message.error("Failed to submit Business Detail. Please try again.");
        });
    } else if (current === 1) {
      if (formData.outletDetail.items.length > 0) {
        setCurrent(current + 1);
      } else {
        message.error("Please add at least one outlet.");
      }
    } else if (current === 2) {
      questionnairesFormRef.current
        ?.submit()
        .then(() => {
          setFormData((prev) => {
            handleSubmit(prev);
            return prev;
          });
        })
        .catch((error) => {
          // console.error("Error submitting Questionnaires:", error);
          // message.error("Failed to submit Questionnaires. Please try again.");
        });
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => setCurrent(current - 1);

  const handleBusinessDetailChange = (data) => {
    setFormData((prev) => ({ ...prev, businessDetail: data }));
  };

  const handleOutletDetailChange = (data) => {
    setFormData((prev) => ({ ...prev, outletDetail: data }));
  };

  const handleQuestionnairesDetailChange = (data) => {
    setFormData((prev) => ({ ...prev, questionnairesDetail: data }));
  };

  const handleSubmit = async (data) => {
    try {
      const businessResponse = await axios.post(
        "/api/saveClientData",
        data.businessDetail
      );

      const businessData = businessResponse.data.data;
      const businessId = businessData._id;

      const outletPromises = data.outletDetail.items.map((outlet) =>
        axios.post("/api/saveOutlet", {
          ...outlet,
          business: businessId,
        })
      );

      await Promise.all(outletPromises);

      await axios.post("/api/saveQuestionary", {
        ...data.questionnairesDetail,
        business: businessId,
      });

      message.success("Client Added Successfully!");
      if (location.pathname === "/client-onboarding") {
        navigate("/client-success");
      } else {
        navigate("/client-profile");
      }
    } catch (error) {
      console.error("Error during submission process:", error);
      message.error("An error occurred during the submission.");
    }
  };

    const baseDivStyle =
      location.pathname === "/client-onboarding" ? { marginLeft: 220 } : {};


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
          ref={questionnairesFormRef}
          data={formData.questionnairesDetail}
          onChange={handleQuestionnairesDetailChange}
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
        <div className="mb-10 border shadow-bottom px-4 py-4 flex items-center">
          {location.pathname !== "/client-onboarding" && (
            <span
              onClick={() => navigate("/client-profile")}
              className="cursor-pointer text-3xl mr-4"
            >
              ←
            </span>
          )}
          <h2 className="text-2xl font-semibold">{newClientTitle}</h2>
        </div>
      </div>

      <div style={stepsContainerStyle}>
        <Steps current={current} items={items} />
      </div>
      <div style={contentStyle}>{steps[current].content}</div>
      <div className="sticky bottom-0  z-50 bg-white w-full p-8 flex justify-start shadow-top">
        <div style={baseDivStyle}>
          <div>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={next}>
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
      </div>
    </>
  );
};

export default AddClientForm;
