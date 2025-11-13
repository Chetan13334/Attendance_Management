import React from "react";
import { Link } from "react-router-dom";

// ✅ Success Toast Component
const SuccessToast = () => (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-2xl p-5 max-w-sm w-full transform transition-all duration-300 hover:scale-105">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-8 w-8 text-white"
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
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-bold">Success!</h3>
          <p className="text-green-100 mt-1">Account created successfully. Redirecting to sign in...</p>
          <div className="mt-3 w-full bg-green-400 rounded-full h-1.5">
            <div className="bg-white h-1.5 rounded-full animate-progress-bar" style={{width: '100%'}}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SignUpUI = ({
  // State
  formData,
  errors,
  loading,
  showSuccessMessage,
  
  // Functions
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className="relative">
      {showSuccessMessage && <SuccessToast />}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter your full name"
            disabled={loading || showSuccessMessage}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

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

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full focus:outline-none focus:ring-2 ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Re-enter your password"
            disabled={loading || showSuccessMessage}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <p className="text-xs text-red-600 text-center">{errors.submit}</p>
        )}
        {errors.error && (
          <p className="text-xs text-red-600 text-center">{errors.error}</p>
        )}

        {/* Sign-Up Button */}
        <button
          type="submit"
          disabled={loading || showSuccessMessage}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition duration-200 ${
            loading || showSuccessMessage
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Sign In Link */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpUI;