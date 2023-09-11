"use client";

import Link from "next/link";
import React, { useState } from "react";
import styles from "./navbar.module.css";
import Button from "../button/Button";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const session = useSession();
  const adminEmail = process.env.ADMIN_EMAIL;

  return (
    <div className={styles.container}>
      <div className={styles.flexContainer}>
        <Link href="/" className={styles.logo}>
          AniFit
        </Link>

        <div className={styles.links}>
          <Link href={"/"} className={styles.link}>
            Home
          </Link>

          {session.data?.user.email === adminEmail && (
            <Link href={"/dashboard"} className={styles.link}>
              Dashboard
            </Link>
          )}

          {session.data?.user.email === adminEmail && (
            <Link href={"/users"} className={styles.link}>
              Users
            </Link>
          )}

          
          <Link href={"/exercises"} className={styles.link}>
            Exercises
          </Link>

          
          {session.status === "unauthenticated" && (
            <Link href={"/dashboard/login"} className={styles.link}>
              Login
            </Link>
          )}

          {session.status === "authenticated" && (
            <button onClick={signOut} className={styles.signOutBtn}>
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
