import React, { useState, useEffect } from 'react';

const ToastBar = ({ toast }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (toast) {
      setShouldRender(true);
      // Trigger animation after a short delay to ensure DOM render
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!shouldRender) return null;

  const bgColor = toast.type === 'success' 
    ? 'bg-green-500' 
    : toast.type === 'error' 
      ? 'bg-red-500' 
      : 'bg-blue-500';

  const borderColor = toast.type === 'success' 
    ? 'border-green-600' 
    : toast.type === 'error' 
      ? 'border-red-600' 
      : 'border-blue-600';

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className={`${bgColor} ${borderColor} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 max-w-md transform transition-transform duration-300 ${
        isVisible ? 'scale-100' : 'scale-95'
      }`}>
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastBar;