import React from "react";
import EmployeeFormUI from "./EmployeeForm.ui";
import { useEmployeeFormData } from "./useEmployeeFormData";

const EmployeeFormContainer = () => {
  const {
    photo,
    showPassword,
    formData,
    loading,
    setShowPassword,
    handlePhotoChange,
    handleChange,
    handleGenderChange,
    handleSubmit,
    navigate
  } = useEmployeeFormData();

  return (
    <EmployeeFormUI
      photo={photo}
      showPassword={showPassword}
      formData={formData}
      loading={loading}
      setShowPassword={setShowPassword}
      handlePhotoChange={handlePhotoChange}
      handleChange={handleChange}
      handleGenderChange={handleGenderChange}
      handleSubmit={handleSubmit}
      navigate={navigate}
    />
  );
};

export default EmployeeFormContainer;