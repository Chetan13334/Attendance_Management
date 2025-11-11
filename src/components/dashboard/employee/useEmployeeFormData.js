import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee } from "../../../redux/slices/employeeSlice";
import { useNavigate } from "react-router-dom";

export const useEmployeeFormData = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [photo, setPhoto] = useState(
    "https://placehold.co/160x160/cbd5e1/000?text=P"
  );

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    Name: "",
    Gender: "",
    ContactNumber: "",
    DateOfJoining: "",
    DateOfBirth: "",
    EmployeeID: "",
    Role: "",
    Department: "",
    Email: "",
    Password: "",
  });

  const loading = useSelector((state) => state.employees.loading);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPhoto(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenderChange = (e) => {
    setFormData((prev) => ({ ...prev, Gender: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.Name ||
      !formData.EmployeeID ||
      !formData.Email ||
      !formData.Password
    ) {
      alert("Please fill in all required fields: Name, Employee ID, Email, and Password.");
      return;
    }

    try {
      const employeeData = {
        ...formData,
        Photo: photo,
      };

      const resultAction = await dispatch(createEmployee(employeeData));

      if (createEmployee.fulfilled.match(resultAction)) {
        alert("✅ Employee added successfully!");
        setFormData({
          Name: "",
          Gender: "",
          ContactNumber: "",
          DateOfJoining: "",
          DateOfBirth: "",
          EmployeeID: "",
          Role: "",
          Department: "",
          Email: "",
          Password: "",
        });
        setPhoto("https://placehold.co/160x160/cbd5e1/000?text=P");
        navigate("/employee_details");
      } else {
        alert("❌ Failed to add employee. Please try again.");
      }
    } catch (error) {
      console.error("EmployeeForm error:", error);
      alert("❌ An unexpected error occurred.");
    }
  };

  return {
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
  };
};