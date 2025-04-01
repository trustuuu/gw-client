import React, { useEffect, useRef } from "react";

const Modal = ({
  isOpen,
  hasCloseBtn,
  onClose,
  children,
  optionBtnLabel,
  onOptionBtnClick,
}) => {
  //const [isModalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef(null);
  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isOpen]);

  const handleCloseModal = () => {
    //if (onClose) {
    onClose();
    //}
    //setModalOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  const className =
    "group relative max-w-40 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10";

  return (
    <dialog
      ref={modalRef}
      onKeyDown={handleKeyDown}
      className="w-1/2 backdrop:backdrop-blur-md"
    >
      {children}
      <div className="flex items-center justify-center">
        {optionBtnLabel && (
          <button className={className + " mr-4"} onClick={onOptionBtnClick}>
            {optionBtnLabel}
          </button>
        )}
        {hasCloseBtn && (
          <button className={className} onClick={handleCloseModal}>
            Close
          </button>
        )}
      </div>
    </dialog>
  );
};

export default Modal;
