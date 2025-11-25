import React, { createContext, useContext, useState, useEffect } from 'react';
import ConfirmPopup from './ConfirmPopup';
import ToastBar from './ToastBar';

const PopupContext = createContext();

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const toastTimeoutRef = React.useRef(null);

  const showToast = (type, message) => {
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    
    setToast({ type, message });
    
    // Auto dismiss after 3 seconds
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 3000);
  };

  const clearToast = () => {
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToast(null);
  };

  const showConfirm = (message, onConfirm) => {
    setConfirm({ message, onConfirm });
  };

  const hideConfirm = () => {
    setConfirm(null);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  return (
    <PopupContext.Provider value={{ showToast, showConfirm, toast, confirm, hideConfirm, clearToast }}>
      {children}
      {toast && <ToastBar toast={toast} />}
      {confirm && <ConfirmPopup confirm={confirm} onCancel={hideConfirm} />}
    </PopupContext.Provider>
  );
};

export default PopupProvider;