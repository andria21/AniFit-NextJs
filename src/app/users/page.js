"use client";

import { useSession } from "next-auth/react";
import styles from "./page.module.css";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import dynamic from "next/dynamic";

export default function Users() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const session = useSession();
  const router = useRouter();

  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, mutate, error, isLoading } = useSWR(`/api/users`, fetcher);

  if (session.status === "unauthenticated") {
    router?.push("/dashboard/login");
  }

  const handleDeleteUser = (user) => {
    setConfirmDelete(user);
  };

  const confirmDeleteAction = async () => {
    try {
      await fetch(`/api/users/${confirmDelete._id}`, {
        method: "DELETE",
      });
      mutate();
      setConfirmDelete(false);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelDeleteAction = () => {
    setConfirmDelete(null);
  };

  // !isLoading && console.log(data, error);
  if (
    session.status === "authenticated" &&
    session.data.user.email === adminEmail
  ) {
    return (
      <div className={styles.container}>
        <h2>All available users:</h2>
        <div className={styles.usersContainer}>
          {isLoading
            ? "Loading..."
            : data.map((user) => (
                <div key={user._id}>
                  <div className={styles.userContainer}>
                    <div className={styles.userUsername}>
                      <h4>{user.name}</h4>
                      <h4>{user.email}</h4>
                      <button
                        className={styles.delete}
                        onClick={() => handleDeleteUser(user)}
                      >
                        Delete
                    </button>
                    {confirmDelete && confirmDelete._id === user._id &&(
                      <div className={styles.answersContainer}>
                        <p>Are you sure you want to delete this user?</p>
                        <button
                          onClick={confirmDeleteAction}
                          className={styles.answerButton}
                        >
                          Yes
                        </button>
                        <button
                          onClick={cancelDeleteAction}
                          className={styles.answerButton}
                        >
                          No
                        </button>
                      </div>
                    )}
                    </div>
                    <br />
                  </div>
                </div>
              ))}
        </div>
      </div>
    );
  }
}

// export default dynamic(() => Promise.resolve(Users), { ssr: false });
