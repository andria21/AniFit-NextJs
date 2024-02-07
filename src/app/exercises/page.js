"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import useSWR from "swr";

import styles from "./page.module.css";

import Footer from "@/components/footer/Footer";

import ExerciseCard from "@/components/ExerciseCard/ExerciseCard";

import ArrowSvg from "../../../public/arrow.svg";
import Image from "next/image";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const adminEmail = process.env.ADMIN_EMAIL;

  const daysLoop = (name, value, destination) => {
    for (let i = 0; i <= 7; i++) {
      return (
        <h1
          className={styles.titleHover}
          onClick={() => router.push(`/exercises/${destination}`)}
        >
          {name}: {value}
        </h1>
      );
    }
  };

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const dataUserName = session?.data?.user.name;
  const { data, mutate, error, isLoading } = useSWR(`/api/exercises`, fetcher);

  const doesUserHaveAccess =
    !isLoading &&
    data.some((post) => session.data?.user.name === post.username);

  if (session.status === "loading") {
    return (
      <div className={styles.mainDiv}>
        <p>Loading...</p>
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    router?.push("/dashboard/login");
  }

  // const handleDeleteExerciseUser = async (name) => {
  //   try {
  //     await fetch(`/api/exercises/${name}`, {
  //       method: "DELETE",
  //     });
  //     mutate();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const organizedData = data?.reduce((acc, exercise) => {
  //   const username = exercise.username;
  //   if (!acc[username]) {
  //     acc[username] = [];
  //   }
  //   acc[username].push(exercise);

  //   return acc;
  // }, {});

  if (
    session.status === "authenticated" &&
    session.data.user.email === adminEmail
  ) {
    return (
      <div className={styles.container}>
        {!isLoading &&
          data
            .filter(
              (user, index, array) =>
                array.findIndex((u) => u.username === user.username) === index
            )
            .map((user) => (
              <div key={user._id}>
                <h1
                  className={styles.userHeader}
                  onClick={() => router.push(`/exercises/${user.username}`)}
                >
                  {user.username}
                </h1>
              </div>
            ))}
      </div>
    );
  } else if (
    session.status === "authenticated" &&
    session.data.user.email !== adminEmail &&
    doesUserHaveAccess !== false
  ) {
    return (
      <div className={styles.mainDiv}>
        {!isLoading &&
          data
            .filter(
              (post) =>
                session.data.user.name === post.username &&
                post.hasOwnProperty("week")
            )
            .map((post) => post.week)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort((a, b) => a - b)
            .map((week) => (
              <div key={week} className={styles.secondMainDiv}>
                <div className={styles.weekTitle}>
                  {daysLoop("Week", week, week)}
                </div>
              </div>
            ))}
      </div>
    );
  } else {
    return (
      <div className={styles.mainDiv}>
        {!isLoading && <p>Please contact Ani to receive exercises.</p>}
      </div>
    );
  }
}

// {daysLoop("Day", post.day)}
// <h4>Description:</h4>
// <p className={styles.postDescription}>{post.description}</p>

// {sortedExercises?.map((workout) => (
//   <ExerciseCard
//     key={workout._id}
//     videoUrl={workout.img}
//     videoTitle={workout.title}
//     videoDesc={workout.desc}
//     videoContent={workout.content}
//     isAdmin={
//       session.status === "authenticated" &&
//       session.data.user.email === adminEmail
//     }
//   />
// ))}
