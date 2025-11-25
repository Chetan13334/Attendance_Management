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
import usePopup from "../../../components/common/popups/usePopup";

// Test environment variables on component mount
const useEnvTest = (showToast) => {
  useEffect(() => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;
    console.log("🔧 Environment variables test:", { cloudName, preset });

    if (!cloudName || !preset) {
      console.error("❌ Cloudinary environment variables are missing!");
      showToast("error", "Cloudinary configuration is missing. Please check your .env file.");
    }
  }, [showToast]);
};

/* ─────────────── Cloudinary Upload Helper ─────────────── */
const uploadToCloudinary = async (file, showToast) => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

    console.log("🔍 Cloudinary config:", { cloudName, preset });

    // Check if environment variables are set
    if (!cloudName || !preset) {
      console.error("❌ Cloudinary environment variables not set");
      showToast("error", "Cloudinary configuration is missing. Please check environment variables.");
      return null;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error("❌ File too large:", file.size);
      showToast("error", "Image size should be less than 5MB");
      return null;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error("❌ Invalid file type:", file.type);
      showToast("error", "Invalid file type. Please upload an image file (JPEG, PNG, GIF, WEBP).");
      return null;
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset);
    form.append("folder", "employees"); // optional, to organize uploads

    // Add some debugging info
    console.log("📁 Form data being sent:", {
      file: file.name,
      size: file.size,
      type: file.type,
      preset: preset,
      folder: "employees"
    });

    console.log("📤 Uploading to Cloudinary:", {
      cloudName,
      fileSize: file.size,
      fileName: file.name,
      fileType: file.type
    });

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const res = await fetch(url, {
      method: "POST",
      body: form,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log("📥 Cloudinary response status:", res.status);

    // Log response headers for debugging
    console.log("📥 Response headers:", [...res.headers.entries()]);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Cloudinary upload failed:", res.status, errorText);

      // Provide more specific error messages
      if (res.status === 401) {
        showToast("error", "Cloudinary authentication failed. Please check your Cloudinary configuration.");
      } else if (res.status === 404) {
        showToast("error", "Cloudinary cloud name not found. Please check your Cloudinary cloud name.");
      } else if (res.status === 400) {
        showToast("error", `Bad request to Cloudinary. This might be due to an invalid upload preset: "${preset}". Please check your Cloudinary dashboard and ensure this upload preset exists and is configured as "Unsigned".`);
      } else {
        showToast("error", `Cloudinary upload failed: ${res.status} - ${errorText}`);
      }
      return null;
    }

    const data = await res.json();
    console.log("✅ Cloudinary Upload Success:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    if (error.name === 'AbortError') {
      showToast("error", "Upload timed out. Please try again with a smaller image.");
    } else {
      showToast("error", `Failed to upload image: ${error.message || 'Unknown error'}`);
    }
    return null;
  }
};
/* ──────────────────────────────────────────────────────── */

export const useEditEmployeeData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast, showConfirm, clearToast } = usePopup();

  // Test environment variables
  useEnvTest(showToast);

  const employees = useSelector((state) => state.employees.list);
  const loading = useSelector((state) => state.employees.loading);

  const [formData, setFormData] = useState(null);
  const [photo, setPhoto] = useState("");
  const [cdnUrl, setCdnUrl] = useState(""); // will store uploaded URL
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Clear toast when component unmounts
  useEffect(() => {
    return () => {
      // Clear any active toast when component unmounts
      clearToast();
    };
  }, []);

  // ✅ Load employee data by ID
  useEffect(() => {
    const selected = employees.find((emp) => emp.id === id);
    if (selected) {
      setFormData(selected);
      if (selected.Photo) setPhoto(selected.Photo);
    }
    return () => dispatch(clearCurrentEmployee());
  }, [id, employees, dispatch]);

  // ✅ Ensure employees are loaded (handle refresh)
  useEffect(() => {
    let unsubscribe;
    if (employees.length === 0) {
      dispatch(listenToEmployees()).then((action) => {
        if (listenToEmployees.fulfilled.match(action)) {
          unsubscribe = action.payload;
        }
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  /* ✅ Handle photo upload + preview */
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("❌ No file selected");
      return;
    }

    console.log("📁 File selected:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validate file first
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast("error", "Invalid file type. Please upload an image file (JPEG, PNG, GIF, WEBP).");
      return;
    }

    // Local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log("🖼️ Preview loaded");
      setPhoto(event.target.result);
    };
    reader.onerror = (error) => {
      console.error("❌ FileReader error:", error);
      showToast("error", "Failed to load image preview.");
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    console.log("🚀 Starting Cloudinary upload...");
    try {
      const uploadedUrl = await uploadToCloudinary(file, showToast);
      if (uploadedUrl) {
        console.log("✅ Photo uploaded successfully:", uploadedUrl);
        setCdnUrl(uploadedUrl);
        showToast("success", "Profile photo updated successfully!");
      } else {
        console.log("❌ Photo upload failed");
        showToast("error", "Failed to upload profile photo. Please try again.");
        setPhoto("");
        setCdnUrl("");
      }
    } catch (error) {
      console.error("❌ Photo upload error:", error);
      showToast("error", "Failed to upload profile photo. Please try again.");
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

  /* ✅ Save updates to Firestore */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData) return;

    const updatedData = {
      ...formData,
      Photo: cdnUrl || photo, // use Cloudinary URL if available
    };

    console.log("📤 Updating employee with data:", updatedData);

    const result = await dispatch(updateEmployeeAsync({ id: formData.id, updatedData }));

    if (updateEmployeeAsync.fulfilled.match(result)) {
      showToast("success", "Employee details updated successfully!");
      // Delay navigation to allow toast to be visible
      setTimeout(() => {
        navigate("/employee_details");
      }, 1500);
    } else {
      showToast("error", "Failed to update employee. Please try again.");
    }
  };

  /* 🗑 Delete Employee */
  const handleDelete = async () => {
    showConfirm("Do you really want to delete this employee?", async () => {
      const result = await dispatch(deleteEmployeeAsync(formData.id));
      if (deleteEmployeeAsync.fulfilled.match(result)) {
        showToast("success", "Employee deleted successfully!");
        // Delay navigation to allow toast to be visible
        setTimeout(() => {
          navigate("/employee_details");
        }, 1500);
      } else {
        showToast("error", "Failed to delete employee. Please try again.");
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