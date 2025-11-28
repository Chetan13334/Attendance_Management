import React from "react";
import { usePopupContext } from "./PopupProvider";
import { CheckCircle, XCircle } from "lucide-react";

const ToastBar = () => {
  const { toastData } = usePopupContext();

  if (!toastData) return null;

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
  };

  const Icon = toastData.type === "success" ? CheckCircle : XCircle;

  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-xl text-white flex items-center gap-3 z-[9999] ${colors[toastData.type]}`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{toastData.message}</span>
    </div>
  );
};

export default ToastBar;
