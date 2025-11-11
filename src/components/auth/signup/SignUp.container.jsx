import React from "react";
import SignUpUI from "./SignUp.ui";
import { useSignUpData } from "./useSignUpData";

const SignUpContainer = () => {
  const signUpData = useSignUpData();

  return <SignUpUI {...signUpData} />;
};

export default SignUpContainer;