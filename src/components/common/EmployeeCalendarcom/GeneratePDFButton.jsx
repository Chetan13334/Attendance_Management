import React from "react";

const GeneratePDFButton = () => {
  return (
    <button
      className="
            bg-blue-400 hover:bg-blue-700 
            text-white 
            font-20
            py-1 px-2 
            rounded-full
            shadow-sm
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500 
            focus:ring-offset-2
            transition-colors 
            duration-150
          "
    >
      Generate PDF
    </button>
  );
};

export default GeneratePDFButton;