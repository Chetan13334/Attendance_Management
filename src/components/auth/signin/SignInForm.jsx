import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInWithEmail, signInWithGoogle, setShowSuccessMessage } from "../../../redux/slices/authSlice";

const SuccessToast = () => /* @__PURE__ */ jsxDEV(
  "div",
  {
    className: "fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 w-11/12 max-w-sm rounded-xl bg-green-50 text-green-800 shadow-2xl border border-green-200 transition-all duration-500 ease-in-out transform scale-100 opacity-100",
    role: "alert"
  },
  /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "flex items-center"
    },
    void 0,
    false,
    {
      fileName: "src/components/auth/signin/SignInForm.jsx",
      lineNumber: 10,
      columnNumber: 5
    },
    this
  ),
  false,
  {
    fileName: "src/components/auth/signin/SignInForm.jsx",
    lineNumber: 7,
    columnNumber: 3
  },
  this
);

const SignInForm = () => {
  return /* @__PURE__ */ jsxDEV(SignInContainer, {}, void 0, false, {
    fileName: "src/components/auth/signin/SignInForm.jsx",
    lineNumber: 50,
    columnNumber: 10
  }, this);
};

export default SignInForm;