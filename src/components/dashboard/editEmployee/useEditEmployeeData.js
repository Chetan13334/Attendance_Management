// src/components/dashboard/editEmployee/useEditEmployeeData.js

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateEmployeeAsync,
  deleteEmployeeAsync,
  clearCurrentEmployee,
  listenToEmployees,
} from "../../../redux/slices/employeeSlice";

// ✅ Import popup system
import { usePopup } from "../../common/popups/usePopup";

// Test environment variables on component mount
const useEnvTest = () => {
  useEffect(() => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;
    console.log("🔧 Environment variables test:", { cloudName, preset });

    if (!cloudName || !preset) {
      console.error("❌ Cloudinary environment variables are missing!");
    }
  }, []);
};

/* ─────────────── Cloudinary Upload Helper ─────────────── */
const uploadToCloudinary = async (file, showToast) => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

    if (!cloudName || !preset) {
      showToast("error", "Cloudinary config missing");
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Image must be below 5MB");
      return null;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast("error", "Invalid file type.");
      return null;
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset);
    form.append("folder", "employees");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(url, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      showToast("error", "Image upload failed");
      return null;
    }

    const data = await res.json();
    showToast("success", "Photo uploaded successfully!");
    return data.secure_url;

  } catch (error) {
    if (error.name === "AbortError") {
      showToast("error", "Upload timeout");
    } else {
      showToast("error", "Upload failed");
    }
    return null;
  }
};
/* ──────────────────────────────────────────────────────── */

export const useEditEmployeeData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { showToast, showConfirm } = usePopup(); // ✅ use popup

  useEnvTest();

  const employees = useSelector((state) => state.employees.list);
  const loading = useSelector((state) => state.employees.loading);

  const [formData, setFormData] = useState(null);
  const [photo, setPhoto] = useState("");
  const [cdnUrl, setCdnUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Helper to format date for input[type="date"] (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Load Employee Data
  useEffect(() => {
    // Robust find: check all possible ID fields
    const selected = employees.find((emp) =>
      emp.EmployeeID === id ||
      emp.id === id ||
      emp._id === id ||
      emp.empId === id
    );

    if (selected) {
      console.log("📋 Selected employee data:", selected);
      console.log("🔑 Password field:", selected.Password || selected.password);
      console.log("👤 Gender field:", selected.Gender || selected.gender);

      setFormData({
        ...selected,
        // Format dates for date inputs
        DateOfJoining: formatDateForInput(selected.DateOfJoining),
        DateOfBirth: formatDateForInput(selected.DateOfBirth),
        // Clear password field (backend returns encrypted hash which is not useful)
        Password: ""
      });
      if (selected.Photo) setPhoto(selected.Photo);
    }
  }, [id, employees, dispatch]);

  // Listen for employees (on refresh) ensures data is there if user straight navigates
  useEffect(() => {
    let unsubscribe;
    if (employees.length === 0) {
      dispatch(listenToEmployees());
    }
  }, [dispatch, employees.length]);

  /* Handle Photo Upload + Preview */
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview
    const reader = new FileReader();
    reader.onload = (event) => setPhoto(event.target.result);
    reader.readAsDataURL(file);

    // upload
    const uploadedUrl = await uploadToCloudinary(file, showToast);
    if (uploadedUrl) {
      setCdnUrl(uploadedUrl);
    } else {
      setPhoto("");
      setCdnUrl("");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, Gender: e.target.value });
  };

  /* Save Employee */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData) return;

    // Transform PascalCase UI fields to camelCase backend fields
    const updatedData = {
      name: formData.Name,
      email: formData.Email,
      employeeId: formData.EmployeeID,
      department: formData.Department,
      designation: formData.Role, // UI's "Role" maps to backend's "designation"
      gender: formData.Gender,
      contactNumber: formData.ContactNumber,
      phone: formData.ContactNumber,
      joiningDate: formData.DateOfJoining,
      dateOfBirth: formData.DateOfBirth,
      address: formData.Address || "",
      image: cdnUrl || photo || formData.Photo,
      // Only include password if it's not empty
      ...(formData.Password && formData.Password.trim() !== "" && { password: formData.Password }),
    };

    const result = await dispatch(updateEmployeeAsync({ id: formData.id, updatedData }));

    if (updateEmployeeAsync.fulfilled.match(result)) {
      showToast("success", "Employee updated successfully!");
      // Refresh employee list to show updated data immediately
      await dispatch(listenToEmployees());
      navigate("/employee_details");
    } else {
      showToast("error", "Failed to update employee");
    }
  };

  /* Delete Employee */
  const handleDelete = () => {
    showConfirm("Do you really want to delete this employee?", async () => {
      const result = await dispatch(deleteEmployeeAsync(formData.id));

      if (deleteEmployeeAsync.fulfilled.match(result)) {
        showToast("success", "Employee deleted!");
        // Refresh employee list to remove deleted employee immediately
        await dispatch(listenToEmployees());
        navigate("/employee_details");
      } else {
        showToast("error", "Failed to delete employee");
      }
    });
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
