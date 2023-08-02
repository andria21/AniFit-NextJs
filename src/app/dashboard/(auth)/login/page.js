"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

import { signIn, useSession } from "next-auth/react";

import Footer from "@/components/footer/Footer";
import Image from "next/image";

export default function Login() {
  const session = useSession();
  const router = useRouter();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (session.status === "loading") {
    return <p>Loading...</p>;
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
        <button type="submit" className={styles.loginButton}>
          Login
        </button>
        <div className={styles.newDiv}>
          <button
            type="text"
            onClick={() => router?.push("/dashboard/register")}
            className={styles.newAccButton}
          >
            - Create a new account -
          </button>
        </div>
      </form>
      <div className={styles.footerContainer}>
        <Footer />
      </div>
    </div>
  );
}
