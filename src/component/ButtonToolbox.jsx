import React from 'react';

//const ButtonDanger = React.forwardRef(({className, ...props}, ref) => <Button ref={ref} className={classNames('btn-default', className)} {...props} />);

const fixedButtonClass="bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";

function ButtonToolbox({
    clickHandle,
    text,
    disabled,
    trigger,
    svg,
    customClass
  }) {
    return (
        <div className="self-center uppercase w-24">
        <button
            ref={trigger}
            onClick={clickHandle}
            disabled={disabled}
            className={customClass ? customClass : fixedButtonClass}
        >
            {svg}
            <span>{text}</span>
        </button>
      </div>
    )
  }

export default ButtonToolbox;