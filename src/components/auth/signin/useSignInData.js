import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInWithEmail, signInWithGoogle, setShowSuccessMessage } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const useSignInData = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, showSuccessMessage } = useSelector((state) => state.auth);

  // Redirect to dashboard when login is successful
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await dispatch(signInWithEmail({
      email: formData.email,
      password: formData.password
    }));

    if (signInWithEmail.rejected.match(result)) {
      setErrors({ submit: "Sign In Failed: " + (result.error.message || "Unknown error") });
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await dispatch(signInWithGoogle());
    
    if (signInWithGoogle.rejected.match(result)) {
      setErrors({ submit: "Google Sign In Failed: " + (result.error.message || "Unknown error") });
    }
  };

  // Reset success message when component unmounts
  useEffect(() => {
    return () => {
      if (showSuccessMessage) {
        dispatch(setShowSuccessMessage(false));
      }
    };
  }, [showSuccessMessage, dispatch]);

  return {
    // State
    formData,
    errors,
    loading,
    showSuccessMessage,
    
    // Functions
    setFormData,
    setErrors,
    handleChange,
    handleSubmit,
    handleGoogleSignIn,
  };
};