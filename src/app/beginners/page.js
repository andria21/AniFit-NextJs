"use client";

import { useSession } from "next-auth/react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Spinner from "@/components/spinner/Spinner";

export default function Beginners() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const session = useSession();
  const router = useRouter();

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(`/api/beginners`, fetcher);

  const handleAddBeginners = async (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const desc = e.target[1].value;
    // const video = e.target[2].value;

    try {
      await fetch("/api/beginners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc,
        }),
      });
      mutate();
      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGuide = async (guideId) => {
    try {
      await fetch(`/api/beginners/${guideId}`, {
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Guide&apos;s for Beginners</h1>
      {session.status === "authenticated" &&
        session.data.user.email === adminEmail && (
          <form
            className={styles.adminInputsContainer}
            onSubmit={handleAddBeginners}
          >
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="desc" className={styles.label}>
                Description:
              </label>
              <textarea
                type="text"
                id="desc"
                name="desc"
                className={styles.input}
              />
            </div>
            <button className={styles.submitButton} type="submit">
              Add
            </button>
          </form>
        )}

      <div className={styles.beginnersData}>
        {isLoading ? (
          <Spinner />
        ) : (
          data.map((guide) => (
            <div key={guide._id} className={styles.guideContainer}>
              <div className={styles.guide}>
                {session.status === "authenticated" &&
                  session.data.user.email === adminEmail && (
                    <span
                      className={styles.delete}
                      onClick={() => handleDeleteGuide(guide._id)}
                    >
                      X
                    </span>
                  )}
                <h3 className={styles.title}>{guide.title}</h3>
                <p>{guide.desc}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
