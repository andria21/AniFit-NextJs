"use client";

import useSWR from "swr";

import styles from "./page.module.css";
import ExerciseCard from "@/components/ExerciseCard/ExerciseCard";
import { useSession } from "next-auth/react";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/navigation";
import ArrowSvg from "../../../../public/arrow.svg";
import Image from "next/image";

export default function UserExercises({ params }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(`/api/exercises`, fetcher);

  const router = useRouter();
  const session = useSession();
  const adminEmail = process.env.ADMIN_EMAIL;

  const daysLoop = (name, value, destination) => {
    for (let i = 0; i <= 7; i++) {
      return (
        <h1
          onClick={() => router.push(`/exercises/${params.id}/${destination}`)}
        >
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

  const filteredData =
    !isLoading && data.filter((user) => user.username === params.id);

  if (
    session.status === "authenticated" &&
    session.data.user.email === adminEmail
  ) {
    return (
      <div className={styles.adminContainer}>
        {!isLoading &&
          filteredData?.map((post) => {
            const sortedExercises = post.exercises
              .flat()
              .sort((a, b) => a.week - b.week)
              .sort((a, b) => a.day - b.day);
            return (
              <>
                <div className={styles.adminSecondContainer}>
                  <div className={styles.adminWeekTitle}>
                    <span
                      className={styles.delete}
                      onClick={() => handleDeleteExerciseUser(post._id)}
                    >
                      Delete All
                    </span>
                    {daysLoop("Week", post.week)}
                    {daysLoop("Day", post.day)}
                    <h4>Description:</h4>
                    <p className={styles.postDescription}>{post.description}</p>
                  </div>

                  {sortedExercises.map((workout) => (
                    <ExerciseCard
                      key={workout._id}
                      videoUrl={workout.img}
                      videoTitle={workout.title}
                      videoDesc={workout.desc}
                      videoContent={workout.content}
                      deleteFunc={handleDeleteSingleExercise}
                      deleteId={post._id}
                      objectId={workout._id}
                      isAdmin={
                        session.status === "authenticated" &&
                        session.data.user.email === adminEmail
                      }
                    />
                  ))}
                </div>
              </>
            );
          })}
      </div>
    );
  } else if (
    session.status === "authenticated" &&
    session.data.user.email !== adminEmail
  ) {
    const filteredDays =
      !isLoading &&
      data.filter(
        (wok) =>
          session.data.user.name === wok.username && wok.week == params.id
      );

    return (
      <div className={styles.mainDiv}>
        {!isLoading &&
          filteredDays.map((day) => (
            <div key={day._id} className={styles.secondMainDiv}>
              <div className={styles.weekTitle}>
                {daysLoop("day", day.day, day.day)}
                <Image
                  src={ArrowSvg}
                  width={60}
                  height={40}
                  alt="arrow svg"
                  className={styles.arrowSvg}
                />
              </div>
            </div>
          ))}
        <div className={styles.footerDiv}>
          <Footer />
        </div>
      </div>
    );
  }
}
