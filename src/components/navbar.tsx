import React from "react";
import Link from "next/link";
import styles from "@/styles/Navbar.module.css";

const Navbar = () => {
  return (
    <div className={`${styles.navbar}`}>
      <Link className={`${styles.navbarLink}`} href="/">
        Home
      </Link>
      <Link className={`${styles.navbarLink}`} href="/login">
        Login
      </Link>
    </div>
  );
};

export default Navbar;
