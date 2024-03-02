"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

import { signIn, useSession } from "next-auth/react";

import Footer from "@/components/footer/Footer";
import Image from "next/image";
import Spinner from "@/components/spinner/Spinner";

export default function Login() {
  const session = useSession();
  const router = useRouter();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (session.status === "loading") {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  if (
    session.status === "authenticated" &&
    adminEmail === session.data?.user.email
  ) {
    router?.push("/dashboard");
  } else if (
    session.status === "authenticated" &&
    adminEmail !== session.data?.user.email
  ) {
    router?.push("/exercises");
  }

  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target[0].value;

    const password = e.target[1].value;

    signIn("credentials", { email, password });
  };

  return (
    <div className={styles.container}>
      <input id={styles.signupToggle} type="checkbox" />
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.formFront}>
          <div className={styles.formDetails}>Login</div>
          <input
            type="text"
            name="email"
            className={styles.input}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            className={styles.input}
            placeholder="Password"
          />
          <button className={styles.btn} type="submit">
            Login
          </button>
          <span className={styles.switch}>
            Don't have an account?
            <label htmlFor="signupToggle" className={styles.signupTog} onClick={() => router?.push("/dashboard/register")}>
              Sign Up
            </label>
          </span>
        </div>
      </form>
    </div>
  );
}

// <div className={styles.formBack}>
//               <div className={styles.formDetails}>Sign Up</div>
//               <input type="text" className={styles.input} placeholder="Firstname" />
//               <input type="text" className={styles.input} placeholder="Username" />
//               <input type="password" className={styles.input} placeholder="Password" />
//               <input type="password" className={styles.input} placeholder="Confirm Password" />
//               <button className={styles.btn}>Sign Up</button>
//               <span className={styles.switch}>Already have an account?
//                   <label htmlFor="signup_toggle" className={styles.signupTog}>
//                       Sign In
//                   </label>
//               </span>
//           </div>
