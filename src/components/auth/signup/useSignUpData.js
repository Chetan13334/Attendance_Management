import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpWithEmail } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const useSignUpData = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // defaulting to hr for now as per user request to create HR account
    role: "hr"
  });
  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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

    const result = await dispatch(signUpWithEmail({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role
    }));

    if (signUpWithEmail.fulfilled.match(result)) {
      setShowSuccessMessage(true);
      // Redirect to signin after showing success message
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } else if (signUpWithEmail.rejected.match(result)) {
      setErrors({ submit: result.error.message });
    }
  };

  return {
    // State
    formData,
    errors,
    loading,
    error,
    showSuccessMessage,

    // Functions
    setFormData,
    setErrors,
    handleChange,
    handleSubmit,
    setShowSuccessMessage,
  };
};