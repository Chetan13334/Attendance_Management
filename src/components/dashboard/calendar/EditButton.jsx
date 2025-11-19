import React, { useState } from "react";
import EditModal from "./EditModal";
import { Pencil } from "lucide-react";

const EditButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = (data) => {
    console.log("Attendance record saved:", data);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="
          w-[30px] h-[30px]
          rounded-full
          bg-neutral-900
          shadow-md
          flex items-center justify-center
          transition-all duration-200
          active:scale-95
        "
      >
        <Pencil className="text-white w-[14px] h-[14px]" />
      </button>

      <EditModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSave}
      />
    </>
  );
};

export default EditButton;
