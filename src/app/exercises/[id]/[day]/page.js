"use client";

import useSWR from "swr";

import styles from "./page.module.css";
import ExerciseCard from "@/components/ExerciseCard/ExerciseCard";
import { useSession } from "next-auth/react";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ArrowSvg from "../../../../../public/arrow.svg";

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
          className={styles.titleHover}
          onClick={() =>
            router.push(`/exercises/${params.id}/${params.day}/${destination}`)
          }
        >
          {name}: {value}
        </h1>
      );
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
    const filteredDays =
      !isLoading &&
      data.filter(
        (wok) => params.id === wok.username && wok.week == params.day
      );

    const nameWithoutPercent = params.id.replace(/%20/g, " ");
    let uniqueWeeks = [];
    const filteredData =
      !isLoading &&
      data
        .filter((item) => {
          if (item.username === nameWithoutPercent && params.day == item.week) {
            if (!uniqueWeeks.includes(item.day)) {
              uniqueWeeks.push(item.day);
              return true;
            }
          }
          return false;
        })
        .sort((a, b) => a.day - b.day);

    // console.log(filteredData);

    return (
      <div className={styles.dayMainDiv}>
        {!isLoading &&
          filteredData.map((item) => (
            <div key={item._id} className={styles.daySecondMainDiv}>
              <div className={styles.dayWeelTitle}>
                {daysLoop("Day", item.day, item.day)}
              </div>
              <span
                className={styles.delete}
                onClick={() => handleDeleteExerciseUser(item._id)}
              >
                Delete
              </span>
            </div>
          ))}
      </div>
    );
  } else if (
    session.status === "authenticated" &&
    session.data.user.email !== adminEmail
  ) {
    const filteredByWeek = !isLoading
      ? data.filter(
          (item) =>
            item.week == params.id &&
            session.data.user.name === item.username &&
            item.day == params.day
        )
      : [];

    // console.log(filteredByWeek);

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
      </div>
    );
  }
}
