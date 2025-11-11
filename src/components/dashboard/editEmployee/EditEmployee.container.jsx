import React from "react";
import EditEmployeeUI from "./EditEmployee.ui";
import { useEditEmployeeData } from "./useEditEmployeeData";

const EditEmployeeContainer = () => {
  const {
    formData,
    photo,
    showPassword,
    loading,
    setShowPassword,
    handlePhotoChange,
    handleChange,
    handleGenderChange,
    handleSave,
    handleDelete,
    navigate
  } = useEditEmployeeData();

  return (
    <EditEmployeeUI
      formData={formData}
      photo={photo}
      showPassword={showPassword}
      loading={loading}
      setShowPassword={setShowPassword}
      handlePhotoChange={handlePhotoChange}
      handleChange={handleChange}
      handleGenderChange={handleGenderChange}
      handleSave={handleSave}
      handleDelete={handleDelete}
      navigate={navigate}
    />
  );
};

export default EditEmployeeContainer;