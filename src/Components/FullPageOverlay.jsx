import React from "react";

const FullPageOverlay = ({ show, onClose, children }) => {
  if (!show) return null; // overlay tabhi dikhe jab show=true

  return (
    <div
      className="fixed inset-0 bg-gray-400  bg-tranparent bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // background ick closes overlay
    >
      <div
        className="bg-white w-1/2 p-6 rounded-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // inner div click doesn't close
      >
        {children}
      </div>
    </div>
  );
};

export default FullPageOverlay;