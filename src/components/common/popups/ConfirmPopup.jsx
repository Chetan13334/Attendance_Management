import React from "react";
import { usePopupContext } from "./PopupProvider";
import { AlertTriangle } from "lucide-react";

const ConfirmPopup = () => {
  const { confirmData, hideConfirm } = usePopupContext();

  if (!confirmData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
        
        <AlertTriangle className="mx-auto text-red-500 w-12 h-12 mb-4" />

        <h2 className="text-xl font-bold text-gray-800">Are you sure?</h2>
        <p className="text-gray-500 mt-2">{confirmData.message}</p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={hideConfirm}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              confirmData.onConfirm();
              hideConfirm();
            }}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
