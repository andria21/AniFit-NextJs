"use client";

import Link from "next/link";
import React, { useState } from "react";
import styles from "./navbar.module.css";
import Button from "../button/Button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Logo from "../../../public/anifit-logo-no-background.png";

import NavbarCloseSVG from "../../../public/navbarCloseSVG.svg";
import HamburgerSVG from "../../../public/hamburgerSVG.svg";

// import { Cormorant_Garamond } from 'next/font/google'

// const cormorant = Cormorant_Garamond({subsets: ["latin"], weight: "300"})

const Navbar = () => {
  const session = useSession();
  const adminEmail = process.env.ADMIN_EMAIL;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.flexContainer}>
        <Link href="/">
          <Image
            className={styles.logo}
            src={Logo}
            width={850}
            height={90}
            alt="Logo"
          />
        </Link>

        <button className={styles.hamburger} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <Image
              src={NavbarCloseSVG}
              width={40}
              height={40}
              alt="close"
              className={styles.closeBtn}
              onClick={toggleMobileMenu}
            />
          ) : (
            <Image
              src={HamburgerSVG}
              width={40}
              height={45}
              alt="hamburger"
              className={styles.bar}
            />
          )}
        </button>

        <div
          className={`${
            isMobileMenuOpen ? styles.hamburgerLinks : styles.links
          }`}
        >
          <Link
            href={"/"}
            className={styles.link}
            onClick={isMobileMenuOpen && closeMobileMenu}
          >
            Home
          </Link>

          <Link
            href={"/beginners"}
            className={styles.link}
            onClick={isMobileMenuOpen && closeMobileMenu}
          >
            Guide
          </Link>

          <Link
            href={"/diet"}
            className={styles.link}
            onClick={isMobileMenuOpen && closeMobileMenu}
          >
            Diet
          </Link>

          {session.data?.user.email === adminEmail && (
            <Link
              href={"/dashboard"}
              className={styles.link}
              onClick={isMobileMenuOpen && closeMobileMenu}
            >
              Dashboard
            </Link>
          )}

          {session.data?.user.email === adminEmail && (
            <Link
              href={"/users"}
              className={styles.link}
              onClick={isMobileMenuOpen && closeMobileMenu}
            >
              Users
            </Link>
          )}

          <Link
            href={"/exercises"}
            className={styles.link}
            onClick={isMobileMenuOpen && closeMobileMenu}
          >
            Exercises
          </Link>

          {session.status === "unauthenticated" && (
            <Link
              href={"/dashboard/login"}
              className={styles.link}
              onClick={isMobileMenuOpen && closeMobileMenu}
            >
              Login
            </Link>
          )}

          {session.status === "authenticated" && (
            <button onClick={signOut} className={styles.signOutBtn}>
              SIGN OUT
            </button>
          )}
          {session.status === "unauthenticated" && (
            <Link
              href={"/dashboard/register"}
              onClick={isMobileMenuOpen && closeMobileMenu}
            >
              <button className={styles.btn}>JOIN NOW</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
