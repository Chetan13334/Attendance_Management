import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';

const SignInUI = ({
  // State
  formData,
  errors,
  loading,

  // Functions
  handleChange,
  handleSubmit,
  handleGoogleSuccess,
  handleGoogleError,
}) => {
  return (
    <div className="relative">
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
            className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full focus:outline-none focus:ring-2 ${errors.email
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
            className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full focus:outline-none focus:ring-2 ${errors.password
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
            Forgot password?
          </Link>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <p className="text-xs text-red-600 text-center">{errors.submit}</p>
        )}
        {errors.error && (
          <p className="text-xs text-red-600 text-center">{errors.error}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition duration-200 ${loading
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
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center my-3">
          <span className="text-sm text-gray-400">or</span>
        </div>

        {/* Google Sign-In */}
        <div className="flex justify-center mt-4 w-full">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleSuccess(credentialResponse);
            }}
            onError={() => {
              handleGoogleError();
            }}
            useOneTap
            theme="filled_blue"
            shape="pill"
            width="350"
          />
        </div>
      </form>
    </div>
  );
};

export default SignInUI;