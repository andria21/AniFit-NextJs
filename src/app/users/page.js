"use client";

import styles from "./page.module.css";

import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import useSWR from "swr";

export default function Users() {
  const session = useSession();
  const router = useRouter();
  const adminEmail = process.env.ADMIN_EMAIL;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, mutate, error, isLoading } = useSWR(`/api/users`, fetcher);

  if (session.status === "authenticated") {
    mutate()
  }

  return (
    <div className={styles.container}>
      <h2>All available users:</h2>
      <div className={styles.usersContainer}>
        <h3 className={styles.username}>Username:</h3>
        {isLoading
          ? "Loading..."
          : data.map((user) => (
              <div key={user._id}>
                <div className={styles.userContainer}>
                  <div className={styles.userUsername}>
                    <h4>{user.name}</h4>
                  </div>
                  <br />
                </div>
              </div>
          ))}
        <br />
        <h3 className={styles.email}>Email:</h3>
        {isLoading
          ? "Loading..."
          : data.map((user) => (
              <div key={user._id}>
                <div className={styles.userContainer}>
                  <div className={styles.userEmailContainer}>
                    <h4>{user.email}</h4>
                  </div>
                  <br />
                </div>
              </div>
            ))}
      </div>

    </div>
  );
}
