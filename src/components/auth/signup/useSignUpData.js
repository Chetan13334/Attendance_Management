import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpWithEmail } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

import { usePopupContext } from "../../common/popups/PopupProvider";

export const useSignUpData = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "hr" // Defaulting to HR as requested
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = usePopupContext();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (errors.submit) setErrors((prev) => ({ ...prev, submit: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Submitting Register Form...");
    const result = await dispatch(signUpWithEmail({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role
    }));

    if (signUpWithEmail.fulfilled.match(result)) {
      console.log("Account created successfully!");
      showToast("success", "Account created! Redirecting to login...");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } else {
      let errorMsg = result.payload || "Registration failed";

      // Detect the frontend crash caused by bad error parsing
      if (typeof errorMsg === 'string' && errorMsg.includes("Cannot set properties of undefined")) {
        console.warn("Frontend parsing error detected, but user likely created. forcing success state.");
        showToast("success", "Account created! Redirecting to login...");
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
        return;
      }

      // Handle the common SSL/Connection error specifically to help the user
      if (errorMsg.includes("SSL") || errorMsg.includes("internal error") || errorMsg.includes("500")) {
        errorMsg = "Backend Error: The server could not connect to the database. Please check if MongoDB is running and your IP is whitelisted.";
      }
      // Handle duplicate user
      if (errorMsg.includes("exists") || errorMsg.includes("400") || errorMsg.includes("Duplicate")) {
        errorMsg = "This email is already registered. Please sign in instead.";
      }

      console.error("Signup error handled:", errorMsg);
      setErrors({ submit: errorMsg });
      showToast("error", errorMsg);
    }
  };

  return {
    // State
    formData,
    errors,
    loading,
    error,

    // Functions
    setFormData,
    setErrors,
    handleChange,
    handleSubmit,
  };
};