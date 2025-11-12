// src/components/dashboard/employee/useEmployeeFormData.js

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee } from "../../../redux/slices/employeeSlice";
import { useNavigate } from "react-router-dom";

// ✅ Helper: Upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  form.append("folder", "employees"); // optional folder

  try {
    const res = await fetch(url, {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.status}`);

    const data = await res.json();
    console.log("✅ Cloudinary Upload Success:", data.secure_url);

    return data.secure_url; // return the hosted image URL
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    return null;
  }
};

export const useEmployeeFormData = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [photo, setPhoto] = useState("https://placehold.co/160x160/cbd5e1/000?text=P");
  const [cdnUrl, setCdnUrl] = useState("");
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

  // ✅ Handle photo upload + preview
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);

    // upload to Cloudinary
    const uploadedUrl = await uploadToCloudinary(file);

    if (uploadedUrl) {
      setCdnUrl(uploadedUrl);
    } else {
      alert("❌ Failed to upload image. Please try again.");
      setCdnUrl("");
      setPhoto("https://placehold.co/160x160/cbd5e1/000?text=P");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenderChange = (e) => {
    setFormData((prev) => ({ ...prev, Gender: e.target.value }));
  };

  // ✅ Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Name || !formData.EmployeeID || !formData.Email || !formData.Password) {
      alert("Please fill in all required fields: Name, Employee ID, Email, and Password.");
      return;
    }

    try {
      const employeeData = {
        ...formData,
        Photo: cdnUrl || photo, // Prefer Cloudinary URL
      };

      const result = await dispatch(createEmployee(employeeData));

      if (createEmployee.fulfilled.match(result)) {
        alert("✅ Employee added successfully!");

        // Reset form
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
        setCdnUrl("");

        navigate("/employee_details");
      } else {
        alert("❌ Failed to add employee. Please try again.");
      }
    } catch (error) {
      console.error("EmployeeForm error:", error);
      alert("❌ Something went wrong. Please try again.");
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
    navigate,
  };
};
