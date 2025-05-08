import React, { useEffect } from "react";

const Modal = ({
  isOpen,
  hasCloseBtn = true,
  onClose,
  children,
  optionBtnLabel,
  onOptionBtnClick,
  customClassName,
  fullWidth,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden"; // prevent background scroll
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalClass = customClassName
    ? customClassName
    : " fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ";
  return (
    <div
      className={modalClass}
      onClick={onClose} // 배경 누르면 닫기
    >
      <div
        className={`${fullWidth} bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-2`}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
      >
        {children}

        <div className="flex justify-end mt-6 px-4 space-x-4">
          {optionBtnLabel && (
            <button
              onClick={onOptionBtnClick}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              {optionBtnLabel}
            </button>
          )}
          {hasCloseBtn && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Modal;
