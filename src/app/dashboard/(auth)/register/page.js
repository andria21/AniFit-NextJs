"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";

export default function Register() {
  const [err, setErr] = useState(false);
  const sharedItems = [];
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const age = e.target[3].value;
    const weight = e.target[4].value;
    const height = e.target[5].value;
    const pulse = e.target[6].value;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          sharedItems,
          age,
          weight,
          height,
          pulse,
        }),
      });

      res.status === 201 &&
        router.push("/dashboard/login?success=Account has been created");
    } catch (error) {
      setErr(true);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Register</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Weight:</label>
          <input
            type="number"
            id="weight"
            name="weight"
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Height:</label>
          <input
            type="number"
            id="height"
            name="height"
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Pulse:</label>
          <input
            type="number"
            id="pulse"
            name="pulse"
            className={styles.input}
            required
          />
        </div>
        <button className={styles.submitButton}>Submit</button>
      </form>
      {err && <h1>{err}</h1>}
    </div>
  );
}
