import React from "react";
import NavbarUI from "./Navbar.ui";
import { useNavbarData } from "./useNavbarData";

const NavbarContainer = (props) => {
  const navbarData = useNavbarData(props);

  return <NavbarUI {...navbarData} {...props} />;
};

export default NavbarContainer;