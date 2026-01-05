import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInWithEmail, signInWithGoogle, setShowSuccessMessage } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

import { usePopupContext } from "../../common/popups/PopupProvider";

export const useSignInData = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = usePopupContext();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  // Fallback direct navigation if PublicRoute fails to detect the change
  useEffect(() => {
    if (isAuthenticated || user) {
      console.log("Auth detected in useSignInData, navigating to dashboard...");
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    setErrors({});
    console.log("Attempting sign in...");
    const result = await dispatch(signInWithEmail({
      email: formData.email,
      password: formData.password
    }));

    if (signInWithEmail.fulfilled.match(result)) {
      console.log("Sign in successful, payload:", result.payload);
      showToast("success", "Welcome back! Login successful.");
      // navigation handled by useEffect above
    } else if (signInWithEmail.rejected.match(result)) {
      let msg = result.payload || result.error?.message || "Invalid email or password";

      // Better text for server crashes
      if (msg.includes("500") || msg.includes("Internal Server Error")) {
        msg = "Server Error (500): The backend crashed. Please check the backend terminal logs.";
      }

      setErrors({ submit: msg });
      showToast("error", msg);
      console.error("Sign in rejected:", msg);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrors({});
    console.log("Google Login payload received, verifying with backend...");
    const result = await dispatch(signInWithGoogle(credentialResponse.credential));

    if (signInWithGoogle.fulfilled.match(result)) {
      console.log("Google Sign in successful");
      showToast("success", "Google Login Successful!");
      navigate("/dashboard");
    } else {
      const msg = result.payload || result.error?.message || "Google verification failed";
      setErrors({ submit: "Google Sign In Failed: " + msg });
      showToast("error", msg);
      console.error("Google Sign in rejected:", msg);
    }
  };

  const handleGoogleError = () => {
    setErrors({ submit: "Google Sign In Failed: Login failed" });
    showToast("error", "Google Login Failed");
  };

  // Reset success message when component unmounts
  useEffect(() => {
    return () => {
      // cleanup if needed
    };
  }, [dispatch]);

  return {
    // State
    formData,
    errors,
    loading,

    // Functions
    setFormData,
    setErrors,
    handleChange,
    handleSubmit,
    handleGoogleSuccess,
    handleGoogleError,
  };
};