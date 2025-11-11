import React from "react";
import SignInUI from "./SignIn.ui";
import { useSignInData } from "./useSignInData";

const SignInContainer = () => {
  const signInData = useSignInData();

  return <SignInUI {...signInData} />;
};

export default SignInContainer;