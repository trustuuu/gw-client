import React, { useState } from "react";
import "../css/stepper.css";
//import { TiTick } from "react-icons/ti";
const Stepper = ({ steps, handleSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, _] = useState(false);
  const [error, setError] = useState(null);
  if (!steps) return <></>;

  const fixedButtonClass =
    "bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";

  const verifyCurrentPage = (e) => {
    console.log("verify", steps[currentStep - 1].verify);
    if (steps[currentStep - 1].verify) {
      const result = steps[currentStep - 1].verify();
      console.log("result", result);
      if (result == "success") {
        setError(null);
      } else {
        setError(result);
        e.preventDefault();
        return;
      }
    }
    if (currentStep === steps.length) {
      handleSubmit(e);
    } else {
      setCurrentStep((prev) => prev + 1);
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="flex justify-between">
        {steps?.map((step, i) => (
          <div>
            <div
              key={i}
              className={`step-item ${currentStep === i + 1 && "active"} ${
                (i + 1 < currentStep || complete) && "complete"
              } `}
            >
              <div className="step">
                {i + 1 < currentStep || complete ? <button size={24} /> : i + 1}
              </div>
              <p className="text-gray-500">{step.title}</p>
            </div>
            {/*                 
            <div id={i} >
              {((currentStep - 1) === i) && step.page}
            </div> */}
          </div>
        ))}
      </div>
      <div className="w-full mt-4 flex items-start h-[600px] overflow-auto">
        {steps?.map((step, i) => (
          <div className="w-full px-4" id={i}>
            {currentStep - 1 === i && step.page}
          </div>
        ))}
      </div>
      {error ? (
        <div className="w-full flex items-center text-red-500">{error}</div>
      ) : null}
      <div className="w-full mt-4 flex justify-between">
        {!complete && currentStep > 1 && (
          <button
            className={fixedButtonClass}
            onClick={(e) => {
              setCurrentStep((prev) => prev - 1);
              e.preventDefault();
            }}
          >
            Previous
          </button>
        )}
        {!complete && (
          <button
            type="button"
            className={fixedButtonClass}
            onClick={(e) => verifyCurrentPage(e)}
          >
            {currentStep === steps.length ? "Finish" : "Next"}
          </button>
        )}
      </div>
    </>
  );
};

export default Stepper;
