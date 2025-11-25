import React, { useState, useEffect } from 'react';

const ConfirmPopup = ({ confirm, onCancel }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (confirm) {
      setShouldRender(true);
      // Trigger animation after a short delay to ensure DOM render
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [confirm]);

  const handleConfirm = () => {
    if (confirm.onConfirm) {
      setIsVisible(false);
      // Wait for animation to complete before executing confirm action
      setTimeout(() => {
        confirm.onConfirm();
        onCancel();
      }, 200);
    } else {
      setIsVisible(false);
      // Wait for animation to complete before unmounting
      setTimeout(() => {
        onCancel();
      }, 200);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before unmounting
    setTimeout(() => {
      onCancel();
    }, 200);
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-lg p-6 w-96 max-w-md shadow-xl transform transition-all duration-200 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Action</h3>
        <p className="text-gray-600 mb-6">{confirm.message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;