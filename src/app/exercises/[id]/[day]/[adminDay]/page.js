"use client";

import useSWR from "swr";

import styles from "./page.module.css";
import ExerciseCard from "@/components/ExerciseCard/ExerciseCard";
import { useSession } from "next-auth/react";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/navigation";

export default function AdminDays({ params }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(`/api/exercises`, fetcher);

  const router = useRouter();
  const session = useSession();
  const adminEmail = process.env.ADMIN_EMAIL;

  const handleDeleteSingleExercise = async (id, objId) => {
    try {
      await fetch(`/api/exercises/${id}/exercises/${objId}`, {
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteExerciseUser = async (userId) => {
    try {
      await fetch(`/api/exercises/${userId}`, {
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  if (
    session.status === "authenticated" &&
    session.data.user.email === adminEmail
  ) {
    const filteredByWeek = !isLoading
      ? data.filter(
          (item) => item.day == params.adminDay && params.id === item.username
        )
      : [];

    return (
      <div className={styles.mainDiv}>
        {!isLoading &&
          filteredByWeek.map((post) => {
            return (
              <>
                <div className={styles.secondMainDiv}>
                  <span className={styles.delete} onClick={() => handleDeleteExerciseUser(post._id)}>Delete</span>
                  <div className={styles.weekTitle}>
                    <h3>Description:</h3>
                    <p className={styles.postDescription}>{post.description}</p>
                  </div>

                  {post.exercises.map((workout) => (
                    <ExerciseCard
                      key={workout._id}
                      videoUrl={workout.img}
                      videoTitle={workout.title}
                      videoDesc={workout.desc}
                      videoContent={workout.content}
                      isAdmin={
                        session.status === "authenticated" &&
                        session.data.user.email === adminEmail
                      }
                      deleteFunc={handleDeleteSingleExercise}
                      deleteId={post._id}
                      objectId={workout._id}
                    />
                  ))}
                </div>
              </>
            );
          })}
        <Footer />
      </div>
    );
  }
}
