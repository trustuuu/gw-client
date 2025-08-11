import React from "react";
import ButtonToolbox from "./ButtonToolbox";

function Toolbox({
  onClickNew,
  onClickDel,
  disabledNew,
  disabledDel,
  NewButtonLabel,
  DelButtonLabel,
  visibleNew,
  customClass,
  disableCaption,
}) {
  //https://www.tailwindtoolbox.com/icons
  const delSvg = (
    <svg
      className="w-4 h-4 mr-2"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {" "}
      <path stroke="none" d="M0 0h24v24H0z" />{" "}
      <line x1="4" y1="7" x2="20" y2="7" />{" "}
      <line x1="10" y1="11" x2="10" y2="17" />{" "}
      <line x1="14" y1="11" x2="14" y2="17" />{" "}
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />{" "}
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
  const downloadSvg = (
    <svg
      className="fill-current w-4 h-4 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
    </svg>
  );
  const newSvg = (
    <svg
      className="h-4 w-4 mr-2"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {" "}
      <path stroke="none" d="M0 0h24v24H0z" />{" "}
      <line x1="9" y1="12" x2="15" y2="12" />{" "}
      <line x1="12" y1="9" x2="12" y2="15" />{" "}
      <path d="M4 6v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1m-5 0h-2m-5 0h-1a1 1 0 0 1 -1 -1v-1m0 -5v-2m0 -5" />
    </svg>
  );
  return (
    <div className="relative inline-flex">
      {visibleNew || visibleNew == undefined ? (
        <ButtonToolbox
          text={disableCaption ? "" : NewButtonLabel ? NewButtonLabel : "New"}
          svg={newSvg}
          clickHandle={onClickNew}
          disabled={disabledNew}
          customClass={customClass}
        />
      ) : (
        <></>
      )}
      <ButtonToolbox
        text={disableCaption ? "" : DelButtonLabel ? DelButtonLabel : "Delete"}
        svg={delSvg}
        clickHandle={onClickDel}
        disabled={disabledDel}
        customClass={customClass}
      />
    </div>
  );
}

export default Toolbox;
