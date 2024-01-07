"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import useSWR from "swr";

import styles from "./page.module.css";

import Footer from "@/components/footer/Footer";

import ExerciseCard from "@/components/ExerciseCard/ExerciseCard";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
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

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const dataUserName = session?.data?.user.name;
  const { data, mutate, error, isLoading } = useSWR(`/api/exercises`, fetcher);

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "unauthenticated") {
    router?.push("/dashboard/login");
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const username = e.target[0].value;

  //   try {
  //     await fetch("/api/exercises", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         username,
  //         dayOne: array,
  //         dayTwo: array,
  //         dayThree: array,
  //         dayFour: array,
  //         dayFive: array,
  //         daySix: array,
  //         daySeven: array,
  //       }),
  //     });
  //     mutate();
  //     e.target.reset();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleDelete = async (id, objId) => {
  //   try {
  //     await fetch(`/api/exercises/${id}/exercises/${objId}`, {
  //       method: "DELETE",
  //     });
  //     mutate();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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

  // const handleAddToCart = () => {
  //   setIsAnimating(true);
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
    session.data.user.email !== adminEmail
  ) {
    return (
      <div className={styles.mainDiv}>
        {data?.map((post) => {
          if (session.data.user.name === post.username) {
            const sortedExercises = post.exercises
              .flat()
              .sort((a, b) => a.week - b.week)
              .sort((a, b) => a.day - b.day);

            return (
              <>
                <div className={styles.secondMainDiv}>
                  <div className={styles.weekTitle}>
                    {daysLoop("Week", post.week)}
                    {daysLoop("Day", post.day)}
                    <h4>Description:</h4>
                    <p className={styles.postDescription}>{post.description}</p>
                  </div>

                  {sortedExercises?.map((workout) => (
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
              </>
            );
          }
        })}
        <Footer />
      </div>
    );
  }
}
