import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import usePopup from './usePopup';

// Custom hook to clear toast when navigating
export const useNavigationToast = () => {
  const location = useLocation();
  const { clearToast } = usePopup();

  useEffect(() => {
    // Clear toast when location changes
    clearToast();
  }, [location, clearToast]);
};

export default useNavigationToast;