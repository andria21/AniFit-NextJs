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
      <div className={styles.mainContainer}>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <h2 className={styles.title}>Login</h2>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.newLoginButton}>
            Login
          </button>
          <div className={styles.newDiv}>
            <button
              type="button"
              onClick={() => router?.push("/dashboard/register")}
              className={styles.newAccButton}
            >
              - Create a new account -
            </button>
          </div>
        </form>
      </div>
      <svg
        className={styles.noise}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
