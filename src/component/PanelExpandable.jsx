import { useState, SVGProps } from "react";
import classNames from "classnames";

export default function PanelExpandable({ title, initExpand, children }) {
  const [open, setOpen] = useState(initExpand ? initExpand : false);

  return (
    <div className="w-full">
      <input
        id="expandCollapse"
        type="checkbox"
        checked={open}
        className="peer sr-only"
        readOnly
      />
      <label
        htmlFor="expandCollapse"
        className={classNames(
          "w-full flex justify-start items-center border-b-2 hover:cursor-pointer"
        )}
        onClick={() => setOpen(!open)}
      >
        {title}
        <ExpandIcon
          height={20}
          width={20}
          className={classNames("ml-4", {
            "rotate-180": open,
          })}
        />
      </label>

      <div
        className={classNames(
          "overflow-hidden h-0",
          "peer-checked:h-full peer-checked:overflow-auto "
        )}
      >
        {children}
      </div>
    </div>
  );
}

const ExpandIcon = ({
  height = 80,
  width = 80,
  "aria-label": ariaLabel,
  className,
  ...props
}) => (
  <svg
    aria-label={ariaLabel}
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <path
      fill="#212121"
      d="M5.161 10.073C4.454 9.265 5.028 8 6.101 8h11.797c1.074 0 1.648 1.265.94 2.073l-5.521 6.31a1.75 1.75 0 0 1-2.634 0l-5.522-6.31ZM6.653 9.5l5.159 5.896a.25.25 0 0 0 .376 0l5.16-5.896H6.652Z"
    />
  </svg>
);
