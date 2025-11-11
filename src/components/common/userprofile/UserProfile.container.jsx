import React from "react";
import UserProfileUI from "./UserProfile.ui";
import { useUserProfileData } from "./useUserProfileData";

const UserProfileContainer = (props) => {
  const userProfileData = useUserProfileData(props);

  return <UserProfileUI {...userProfileData} {...props} />;
};

export default UserProfileContainer;