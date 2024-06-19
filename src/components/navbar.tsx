import React from "react";
import Link from "next/link";
import { Box } from "@chakra-ui/react";
import styles from "@/styles/Navbar.module.css";

const Navbar = () => {
  return (
    <Box className={`${styles.navbar}`}>
      <Link className={`${styles.navbarLink}`} href="/">
        Home
      </Link>
      <Link className={`${styles.navbarLink}`} href="/login">
        Login
      </Link>
    </Box>
  );
};

export default Navbar;
