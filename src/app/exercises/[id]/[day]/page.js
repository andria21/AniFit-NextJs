"use client";

import useSWR from "swr";

import styles from "./page.module.css";
import ExerciseCard from "@/components/ExerciseCard/ExerciseCard";
import { useSession } from "next-auth/react";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/navigation";

export default function UserExercises({ params }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(`/api/exercises`, fetcher);

  const router = useRouter();
  const session = useSession();
  const adminEmail = process.env.ADMIN_EMAIL;

  const daysLoop = (name, value) => {
    for (let i = 0; i <= 7; i++) {
      return (
        <h1>
          {name}: {value}
        </h1>
      );
    }
  };

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
    session.data.user.email !== adminEmail
  ) {
    const filteredByWeek = !isLoading
      ? data.filter(
          (item) =>
            item.day == params.day && session.data.user.name === item.username
        )
      : [];
    return (
      <div className={styles.mainDiv}>
        {!isLoading &&
          filteredByWeek.map((post) => {
            if (session.data.user.name === post.username) {
              return (
                <>
                  <div className={styles.secondMainDiv}>
                    <div className={styles.weekTitle}>
                      
                      <h3>Description:</h3>
                      <p className={styles.postDescription}>
                        {post.description}
                      </p>
                    </div>

                    {filteredByWeek?.map((exe) =>
                      exe.exercises.map((workout) => (
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
                        />
                      ))
                    )}
                  </div>
                </>
              );
            }
          })}
        <Footer />
      </div>
    );
  }
}
