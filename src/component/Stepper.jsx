import React, { useState } from "react";
import "../css/stepper.css";
//import { TiTick } from "react-icons/ti";
const Stepper = ({ steps, handleSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  if (!steps) return <></>;

  const fixedButtonClass =
    "bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";

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
      <div className="w-full flex items-center">
        {steps?.map((step, i) => (
          <div className="w-full" id={i}>
            {currentStep - 1 === i && step.page}
          </div>
        ))}
      </div>
      <div className="w-full flex justify-between">
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
            className={fixedButtonClass}
            onClick={(e) => {
              currentStep === steps.length
                ? handleSubmit(e)
                : setCurrentStep((prev) => prev + 1);
              e.preventDefault();
            }}
          >
            {currentStep === steps.length ? "Finish" : "Next"}
          </button>
        )}
      </div>
    </>
  );
};

export default Stepper;
