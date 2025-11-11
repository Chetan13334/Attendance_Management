import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";

// --- Helper functions (MOVED FROM UI) ---

export const getRoleColor = (role) => {
  if (!role) return "bg-gray-100 text-gray-700";

  const lowerCaseRole = role.toLowerCase().trim();

  if (lowerCaseRole.includes("frontend")) {
    return "bg-yellow-100 text-yellow-700";
  } else if (lowerCaseRole.includes("backend")) {
    return "bg-red-100 text-red-700";
  } else if (lowerCaseRole.includes("fullstack")) {
    return "bg-purple-100 text-purple-700";
  } else if (
    lowerCaseRole.includes("software developer") ||
    lowerCaseRole.includes("developer")
  ) {
    return "bg-green-100 text-green-700";
  } else if (lowerCaseRole.includes("manager")) {
    return "bg-blue-100 text-blue-700";
  } else {
    return "bg-indigo-100 text-indigo-700";
  }
};

export const getGenderColor = (gender) => {
  if (!gender) return "bg-gray-100 text-gray-700";

  const lowerCaseGender = gender.toLowerCase().trim();

  if (lowerCaseGender === "male") {
    return "bg-sky-100 text-sky-700";
  } else if (lowerCaseGender === "female") {
    return "bg-pink-100 text-pink-700";
  } else {
    return "bg-gray-200 text-gray-700";
  }
};

export const useEmployeeDetailsData = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // ✅ Get data and state from the Redux store
  const employees = useSelector((state) => state.employees.list); 
  const loading = useSelector((state) => state.employees.loading); 
  const error = useSelector((state) => state.employees.error); 

  useEffect(() => {
    // ✅ Dispatch the asynchronous thunk to fetch data
    dispatch(listenToEmployees());
  }, [dispatch]);

  return {
    employees,
    loading,
    error,
    navigate
  };
};