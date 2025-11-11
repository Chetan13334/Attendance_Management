import React from "react";
import { Link } from "react-router-dom";

const SignUpUI = ({
  // State
  formData,
  errors,
  loading,
  
  // Functions
  handleChange,
  handleSubmit,
}) => {
  return (
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
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
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium transition duration-200 ${
          loading
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
  );
};

export default SignUpUI;