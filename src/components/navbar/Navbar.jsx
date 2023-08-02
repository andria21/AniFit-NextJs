"use client";

import Link from "next/link";
import React, { useState } from "react";
import styles from "./navbar.module.css";
import Button from "../button/Button";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [isNavbarVisible, setNavbarVisibility] = useState(false);

  const toggleNavbar = () => {
    setNavbarVisibility(!isNavbarVisible);
  };
  const session = useSession();
  const adminEmail = session.data?.user.email;

  return (
    <div className={styles.container}>
      <div className={styles.hamburger} onClick={toggleNavbar}>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </div>
      <div className={styles.flexContainer}>
        <Link href="/" className={styles.logo}>
          AniFit
        </Link>

        <div
          className={
            styles.links + (isNavbarVisible ? ` ${styles.showNav}` : "")
          }
        >
          <Link href={"/"} className={styles.link}>
            Home
          </Link>

          {session.status === "authenticated" &&
            session.data?.user.email === adminEmail && (
              <Link href={"/dashboard"} className={styles.link}>
                Dashboard
              </Link>
            )}

          <Link href={"/exercises"} className={styles.link}>
            Exercises
          </Link>
          <Link href={"/dashboard/login"} className={styles.link}>
            Login
          </Link>
          {session.status === "authenticated" && (
            <button onClick={signOut} className={styles.btn}>
              SIGN OUT
            </button>
          )}
          {session.status === "unauthenticated" && (
            <Link href={"/dashboard/register"}>
              <button className={styles.btn}>JOIN NOW</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
