// src/components/dashboard/employee/useEmployeeFormData.js

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee } from "../../../redux/slices/employeeSlice";
import { useNavigate } from "react-router-dom";

// Test environment variables on component mount
const useEnvTest = () => {
  useEffect(() => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;
    console.log("🔧 Environment variables test:", { cloudName, preset });
    
    if (!cloudName || !preset) {
      console.error("❌ Cloudinary environment variables are missing!");
      alert("Cloudinary configuration is missing. Please check your .env file.");
    }
  }, []);
};

// ✅ Helper: Upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;
    
    console.log("🔍 Cloudinary config:", { cloudName, preset });
    
    // Check if environment variables are set
    if (!cloudName || !preset) {
      console.error("❌ Cloudinary environment variables not set");
      alert("Cloudinary configuration is missing. Please check environment variables.");
      return null;
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error("❌ File too large:", file.size);
      alert("Image size should be less than 5MB");
      return null;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error("❌ Invalid file type:", file.type);
      alert(`Invalid file type. Please upload an image file (JPEG, PNG, GIF, WEBP).`);
      return null;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset);
    form.append("folder", "employees"); // optional folder
    
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
        alert("Cloudinary authentication failed. Please check your Cloudinary configuration.");
      } else if (res.status === 404) {
        alert("Cloudinary cloud name not found. Please check your Cloudinary cloud name.");
      } else if (res.status === 400) {
        alert(`Bad request to Cloudinary. This might be due to an invalid upload preset: "${preset}". Please check your Cloudinary dashboard and ensure this upload preset exists and is configured as "Unsigned".`);
      } else {
        alert(`Cloudinary upload failed: ${res.status} - ${errorText}`);
      }
      return null;
    }

    const data = await res.json();
    console.log("✅ Cloudinary Upload Success:", data.secure_url);
    
    return data.secure_url; // return the hosted image URL
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    if (error.name === 'AbortError') {
      alert("Upload timed out. Please try again with a smaller image.");
    } else {
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`);
    }
    return null;
  }
};

export const useEmployeeFormData = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Test environment variables
  useEnvTest();

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
      alert(`Invalid file type. Please upload an image file (JPEG, PNG, GIF, WEBP).`);
      return;
    }

    // show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => {
      console.log("🖼️ Preview loaded");
      setPhoto(ev.target.result);
    };
    reader.onerror = (error) => {
      console.error("❌ FileReader error:", error);
      alert("Failed to load image preview.");
    };
    reader.readAsDataURL(file);

    // upload to Cloudinary
    console.log("🚀 Starting Cloudinary upload...");
    try {
      const uploadedUrl = await uploadToCloudinary(file);

      if (uploadedUrl) {
        console.log("✅ Photo uploaded successfully:", uploadedUrl);
        setCdnUrl(uploadedUrl);
        alert("✅ Photo uploaded successfully!");
      } else {
        console.log("❌ Photo upload failed");
        alert("❌ Failed to upload image. Please try again.");
        setCdnUrl("");
        setPhoto("https://placehold.co/160x160/cbd5e1/000?text=P");
      }
    } catch (error) {
      console.error("❌ Photo upload error:", error);
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
      
      console.log("📤 Creating employee with data:", employeeData);

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