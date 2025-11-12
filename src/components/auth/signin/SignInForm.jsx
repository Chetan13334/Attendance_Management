import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInWithEmail, signInWithGoogle, setShowSuccessMessage } from "../../../redux/slices/authSlice";
import SignInContainer from "./SignIn.container";

const SuccessToast = () => (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 w-11/12 max-w-sm rounded-xl bg-green-50 text-green-800 shadow-2xl border border-green-200 transition-all duration-500 ease-in-out transform scale-100 opacity-100">
    <div className="flex items-center">
      {/* Content would go here */}
    </div>
  </div>
);

const SignInForm = () => {
  return <SignInContainer />;
};

export default SignInForm;