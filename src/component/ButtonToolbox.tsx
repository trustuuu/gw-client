import React from "react";

const fixedButtonClass =
  "bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center w-24";

type ButtonToolboxProps = {
  clickHandle: () => void;
  text: string;
  disabled: boolean;
  trigger?: any;
  svg?: any;
  customClass?: string;
}

const ButtonToolbox = React.memo(({
  clickHandle,
  text,
  disabled,
  trigger,
  svg,
  customClass,
}:ButtonToolboxProps) => {
  return (
    <div className="self-center uppercase">
      <button
        type="button"
        ref={trigger}
        onClick={clickHandle}
        disabled={disabled}
        className={customClass ? customClass : fixedButtonClass}
      >
        {svg}
        <span>{text}</span>
      </button>
    </div>
  );
});

export default ButtonToolbox;
