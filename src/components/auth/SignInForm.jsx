import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInWithEmail, signInWithGoogle, setShowSuccessMessage } from "../../redux/slices/authSlice";

// ✅ Success Toast Component
const SuccessToast = () => (
  <div
    className="fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 w-11/12 max-w-sm rounded-xl bg-green-50 text-green-800 shadow-2xl border border-green-200 transition-all duration-500 ease-in-out transform scale-100 opacity-100"
    role="alert"
  >
    <div className="flex items-center">
      <svg
        className="h-6 w-6 text-green-500 flex-shrink-0 mr-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <h3 className="text-lg font-semibold">Login Successful!</h3>
        <p className="text-sm">You will be redirected shortly.</p>
      </div>
    </div>
  </div>
);

const SignInForm = () => {
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

  return (
    <div className="relative">
      {showSuccessMessage && <SuccessToast />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter your email"
            disabled={loading || showSuccessMessage}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter your password"
            disabled={loading || showSuccessMessage}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading || showSuccessMessage}
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
            Forgot password?
          </a>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <p className="text-xs text-red-600 text-center">{errors.submit}</p>
        )}
        {error && (
          <p className="text-xs text-red-600 text-center">{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || showSuccessMessage}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition duration-200 ${
            loading || showSuccessMessage
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </Link>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || showSuccessMessage}
            className="w-full flex items-center justify-center gap-5 py-2.5 px-6 text-[15px] font-medium tracking-wide text-slate-900 border border-slate-300 rounded-md bg-slate-50 hover:bg-slate-100 focus:outline-none cursor-pointer mt-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              className="inline"
              viewBox="0 0 512 512"
            >
              <path
                fill="#fbbd00"
                d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
              />
              <path
                fill="#0f9d58"
                d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
              />
              <path
                fill="#31aa52"
                d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
              />
              <path
                fill="#3c79e6"
                d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
              />
              <path
                fill="#cf2d48"
                d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
              />
              <path
                fill="#eb4132"
                d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;