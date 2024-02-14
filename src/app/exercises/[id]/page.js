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
          className={styles.titleHover}
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
    const exe =
      !isLoading && data.filter((item) => item.username === params.id);

    const nameWithoutPercent = params.id.replace(/%20/g, " ");
    let uniqueWeeks = [];
    const filteredData =
      !isLoading &&
      data
        .filter((item) => {
          if (item.username === nameWithoutPercent) {
            if (!uniqueWeeks.includes(item.week)) {
              uniqueWeeks.push(item.week);
              return true;
            }
          }
          return false;
        })
        .sort((a, b) => a.day - b.day);

    return (
      <div className={styles.adminContainer}>
        {!isLoading &&
          filteredData.map((post) => (
            <div key={post._id} className={styles.adminSecondContainer}>
              <div className={styles.weekTitle}>
                {daysLoop("Week", post.week, post.week)}
              </div>
              <span
                className={styles.delete}
                onClick={() => handleDeleteExerciseUser(post._id)}
              >
                Delete
              </span>
            </div>
          ))}
      </div>
    );
  } else if (
    session.status === "authenticated" &&
    session.data.user.email !== adminEmail &&
    doesUserHaveAccess !== false
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
          data
            .filter(
              (post) =>
                session.data.user.name === post.username &&
                post.week == params.id &&
                post.hasOwnProperty("day")
            )
            .map((post) => post.day)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort((a, b) => a - b)
            .map((day) => (
              <div key={day._id} className={styles.secondMainDiv}>
                <div className={styles.weekTitle}>
                  {daysLoop("day", day, day)}
                </div>
              </div>
            ))}
      </div>
    );
  } else {
    return (
      <div>
        {!isUserLoading &&
          userData.map((user) => {
            if (
              session.data?.user.name === user.name &&
              user.gender === "male"
            ) {
              return (
                <div className={styles.mainDiv}>
                  {!isLoading && (
                    <p className={styles.contactToAniText}>
                      Hey there! Reach out to Ani to get your hands on some
                      exercises.
                      <br />
                      These are some basic exercises you can start with before
                      getting ones tailored specifically for your body.
                    </p>
                  )}
                  {!isLoading &&
                    data
                      .filter(
                        (post) =>
                          post.username === "male" &&
                          post.week == params.id &&
                          post.hasOwnProperty("day")
                      )
                      .map((post) => post.day)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index
                      )
                      .sort((a, b) => a - b)
                      .map((day) => (
                        <div key={day._id} className={styles.secondMainDiv}>
                          <div className={styles.weekTitle}>
                            {daysLoop("day", day, day)}
                          </div>
                        </div>
                      ))}
                </div>
              );
            } else if (
              session.data?.user.name === user.name &&
              user.gender === "female"
            ) {
              return (
                <div className={styles.mainDiv}>
                  {!isLoading && (
                    <p className={styles.contactToAniText}>
                      Hey there! Reach out to Ani to get your hands on some
                      exercises.
                      <br />
                      These are some basic exercises you can start with before
                      getting ones tailored specifically for your body.
                    </p>
                  )}
                  {!isLoading &&
                    data
                      .filter(
                        (post) =>
                          post.username === "female" &&
                          post.week == params.id &&
                          post.hasOwnProperty("day")
                      )
                      .map((post) => post.day)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index
                      )
                      .sort((a, b) => a - b)
                      .map((day) => (
                        <div key={day._id} className={styles.secondMainDiv}>
                          <div className={styles.weekTitle}>
                            {daysLoop("day", day, day)}
                          </div>
                        </div>
                      ))}
                </div>
              );
            }
          })}
      </div>
    );
  }
}

/*

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
*/
