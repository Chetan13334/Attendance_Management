// src/components/dashboard/editEmployee/useEditEmployeeData.js

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateEmployeeAsync,
  deleteEmployeeAsync,
  clearCurrentEmployee,
} from "../../../redux/slices/employeeSlice";

/* ─────────────── Cloudinary Upload Helper ─────────────── */
const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  form.append("folder", "employees"); // optional, to organize uploads

  try {
    const res = await fetch(url, { method: "POST", body: form });
    if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.status}`);
    const data = await res.json();
    console.log("✅ Cloudinary Upload Success:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    return null;
  }
};
/* ──────────────────────────────────────────────────────── */

export const useEditEmployeeData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const employees = useSelector((state) => state.employees.list);
  const loading = useSelector((state) => state.employees.loading);

  const [formData, setFormData] = useState(null);
  const [photo, setPhoto] = useState("https://placehold.co/160x160/cbd5e1/000?text=P");
  const [cdnUrl, setCdnUrl] = useState(""); // will store uploaded URL
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Load employee data by ID
  useEffect(() => {
    const selected = employees.find((emp) => emp.id === id);
    if (selected) {
      setFormData(selected);
      if (selected.Photo) setPhoto(selected.Photo);
    }
    return () => dispatch(clearCurrentEmployee());
  }, [id, employees, dispatch]);

  /* ✅ Handle photo upload + preview */
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = (event) => setPhoto(event.target.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    const uploadedUrl = await uploadToCloudinary(file);
    if (uploadedUrl) {
      setCdnUrl(uploadedUrl);
      alert("✅ Profile photo updated successfully!");
    } else {
      alert("❌ Failed to upload profile photo. Please try again.");
      setPhoto("https://placehold.co/160x160/cbd5e1/000?text=P");
      setCdnUrl("");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, Gender: e.target.value });
  };

  /* ✅ Save updates to Firestore */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData) return;

    const updatedData = {
      ...formData,
      Photo: cdnUrl || photo, // use Cloudinary URL if available
    };

    const result = await dispatch(updateEmployeeAsync({ id: formData.id, updatedData }));

    if (updateEmployeeAsync.fulfilled.match(result)) {
      alert("✅ Employee details updated successfully!");
      navigate("/employee_details");
    } else {
      alert("❌ Failed to update employee. Please try again.");
    }
  };

  /* 🗑 Delete Employee */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    const result = await dispatch(deleteEmployeeAsync(formData.id));
    if (deleteEmployeeAsync.fulfilled.match(result)) {
      alert("🗑️ Employee deleted successfully!");
      navigate("/employee_details");
    }
  };

  return {
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
    navigate,
  };
};
