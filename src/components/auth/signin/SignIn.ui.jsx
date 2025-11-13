import React from "react";
import { Link } from "react-router-dom";

// ✅ Success Toast Component
const SuccessToast = () => (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-2xl p-5 max-w-sm w-full transform transition-all duration-300 hover:scale-105">
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
          <h3 className="text-lg font-bold">Welcome Back!</h3>
          <p className="text-blue-100 mt-1">Login successful. Redirecting to dashboard...</p>
          <div className="mt-3 w-full bg-blue-400 rounded-full h-1.5">
            <div className="bg-white h-1.5 rounded-full animate-progress-bar" style={{width: '100%'}}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SignInUI = ({
  // State
  formData,
  errors,
  loading,
  showSuccessMessage,
  
  // Functions
  handleChange,
  handleSubmit,
  handleGoogleSignIn,
}) => {
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
        {errors.error && (
          <p className="text-xs text-red-600 text-center">{errors.error}</p>
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
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center my-3">
          <span className="text-sm text-gray-400">or</span>
        </div>

        {/* Google Sign-In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || showSuccessMessage}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-6 text-[15px] font-medium tracking-wide text-slate-900 border border-slate-300 rounded-md bg-slate-50 hover:bg-slate-100 focus:outline-none cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>
      </form>
    </div>
  );
};

export default SignInUI;