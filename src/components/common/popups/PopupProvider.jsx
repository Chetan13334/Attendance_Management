import { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [confirmData, setConfirmData] = useState(null);
  const [toastData, setToastData] = useState(null);

  const showConfirm = (message, onConfirm, confirmText = "Confirm") => {
    setConfirmData({ message, onConfirm, confirmText });
  };

  const hideConfirm = () => setConfirmData(null);

  const showToast = (type, message) => {
    setToastData({ type, message });
    setTimeout(() => setToastData(null), 2500);
  };

  return (
    <PopupContext.Provider value={{ showConfirm, showToast, confirmData, hideConfirm, toastData }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopupContext = () => useContext(PopupContext);
