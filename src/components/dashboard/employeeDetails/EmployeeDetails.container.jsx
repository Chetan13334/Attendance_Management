import React from "react";
import EmployeeDetailsUI from "./EmployeeDetails.ui";
import { useEmployeeDetailsData } from "./useEmployeeDetailsData";

const EmployeeDetailsContainer = () => {
  const {
    employees,
    loading,
    error,
    navigate
  } = useEmployeeDetailsData();

  return (
    <EmployeeDetailsUI
      employees={employees}
      loading={loading}
      error={error}
      navigate={navigate}
    />
  );
};

export default EmployeeDetailsContainer;