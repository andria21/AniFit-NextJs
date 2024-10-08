"use client";

import useSWR from "swr";

import styles from "./page.module.css";
import ExerciseCard from "@/components/ExerciseCard/ExerciseCard";
import { useSession } from "next-auth/react";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ArrowSvg from "../../../../../public/arrow.svg";
import Spinner from "@/components/spinner/Spinner";
import HeroSection from "@/components/HeroSectionContainer/HeroSection";

import hero_rope from "../../../../../public/hero_rope.jpg";

export default function UserExercises({ params }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(`/api/exercises`, fetcher);

  const router = useRouter();
  const session = useSession();
  const adminEmail = process.env.ADMIN_EMAIL;

  const {
    data: userData,
    mutate: userMutate,
    error: userError,
    isLoading: isUserLoading,
  } = useSWR(`/api/users`, fetcher);

  const doesUserHaveAccess =
    !isLoading &&
    data.some((post) => session.data?.user.name === post.username);

  const daysLoop = (name, value, destination) => {
    for (let i = 0; i <= 7; i++) {
      return (
        <h1
          className={styles.titleHoverForADays}
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

  if (session.status === "loading" || isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spinner />
      </div>
    );
  }

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
      <>
        <HeroSection iamgeURL={hero_rope} imageHeading={"Day Selection"} />

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
      </>
    );
  } else if (
    session.status === "authenticated" &&
    session.data.user.email !== adminEmail &&
    doesUserHaveAccess !== false
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
                <div key={post._id} className={styles.secondMainDiv}>
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
                      driveImage={workout.driveImage}
                      isAdmin={
                        session.status === "authenticated" &&
                        session.data.user.email === adminEmail
                      }
                    />
                  ))}
                </div>
              );
            }
          })}
      </div>
    );
  } else {
    const isMale =
      !isUserLoading &&
      userData.some(
        (user) =>
          session.data?.user.name === user.name && user.gender === "male"
      );
    const isFemale =
      !isUserLoading &&
      userData.some(
        (user) =>
          session.data?.user.name === user.name && user.gender === "female"
      );
    const filteredByWeek = !isLoading
      ? data.filter((item) => item.week == params.id && item.day == params.day)
      : [];

    return (
      <div className={styles.mainDiv}>
        {!isLoading &&
          filteredByWeek.map((post) => {
            if (post.username === "male" && isMale) {
              return (
                <div key={post._id} className={styles.secondMainDiv}>
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
                    />
                  ))}
                </div>
              );
            } else if (post.username === "female" && isFemale) {
              return (
                <div key={post._id} className={styles.secondMainDiv}>
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
                    />
                  ))}
                </div>
              );
            }
          })}
      </div>
    );
  }
}
