import React, { useState, useRef, useEffect } from "react";
import Transition from "../utils/Transition";

function Dropdown({ label, align, data, changeHandler }) {
  //const data = items.maps(d => {return {key:d.id, value:d.name}});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (target.id !== "#root#") changeHandler(target.id);
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const fixedButtonClass =
    "w-40 h-10 bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 py-2 px-4 rounded inline-end items-center";

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={trigger}
        className={`${fixedButtonClass} ${dropdownOpen}`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        id="#root#"
      >
        {/* <svg className="w-[24px] h-[24px] fill-[#8e8e8e]" viewBox="0 0 448 512" >
          <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"></path>
        </svg> */}
        <span>{label}</span>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-3">
            {label}
          </div>
          <ul>
            {data ? (
              data.map((item) => {
                return (
                  <li key={item.key}>
                    <div
                      className="font-medium text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                      //to="#0"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <svg
                        className="w-3 h-3 fill-current text-indigo-300 dark:text-indigo-500 shrink-0 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <rect y="3" width="12" height="9" rx="1" />
                        <path d="M2 0h8v2H2z" />
                      </svg>
                      <span id={item.key}>{item.value}</span>
                    </div>
                  </li>
                );
              })
            ) : (
              <></>
            )}
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default Dropdown;
