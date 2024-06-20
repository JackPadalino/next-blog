import React, { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "../firebase/firebaseApp";
import { Box } from "@chakra-ui/react";
import styles from "@/styles/Navbar.module.css";

const Navbar = () => {
  const user = auth.currentUser; // currently signed in user?

  return (
    <Box className={styles.navbar}>
      <Box className={styles.navbarLeft}>
        <Link className={styles.navbarLink} href="/">
          Home
        </Link>
        <Link className={styles.navbarLink} href="/posts">
          Posts
        </Link>
      </Box>
      {user ? (
        <Link className={styles.navbarLink} href="/logout">
          Logout
        </Link>
      ) : (
        <Link className={styles.navbarLink} href="/login">
          Login
        </Link>
      )}
    </Box>
  );
};

export default Navbar;
