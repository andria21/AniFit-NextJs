"use client"
import styles from "./page.module.css";

import useSWR from "swr";
// import dynamic from "next/dynamic";

export default function Users() {
  const adminEmail = process.env.ADMIN_EMAIL;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, mutate, error, isLoading } = useSWR(`/api/users`, fetcher);

  !isLoading && console.log(data, error);

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

// export default dynamic(() => Promise.resolve(Users), { ssr: false });