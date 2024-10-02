"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import useSWR from "swr";

import styles from "./page.module.css";

import Footer from "@/components/footer/Footer";

import ExerciseCard from "@/components/ExerciseCard/ExerciseCard";

import ArrowSvg from "../../../public/arrow.svg";
import Image from "next/image";

import Spinner from "@/components/spinner/Spinner";
import HeroSection from "@/components/HeroSectionContainer/HeroSection";

import hero_barbell from "../../../public/hero_barbell.jpg";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const adminEmail = process.env.ADMIN_EMAIL;

  const daysLoop = (name, value, destination) => {
    for (let i = 0; i <= 7; i++) {
      return (
        <h1
          className={styles.titleHoverForExercise}
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
  const {
    data: userData,
    mutate: userMutate,
    error: userError,
    isLoading: isUserLoading,
  } = useSWR(`/api/users`, fetcher);

  const doesUserHaveAccess =
    !isLoading &&
    data.some((post) => session.data?.user.name === post.username);

  if (session.status === "loading" || isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spinner />
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    router?.push("/dashboard/login");
  }

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
                <button
                  className={styles.userHeader}
                  onClick={() => router.push(`/exercises/${user.username}`)}
                >
                  {user.username}
                </button>
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
      <>
        <HeroSection iamgeURL={hero_barbell} imageHeading={"Week Selection"} />

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
      </>
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
                <div key={user._id} className={styles.mainDiv}>
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
                          post.hasOwnProperty("week")
                      )
                      .map((post) => post.week)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index
                      )
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
            } else if (
              session.data?.user.name === user.name &&
              user.gender === "female"
            ) {
              return (
                <div key={user._id} className={styles.mainDiv}>
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
                          post.hasOwnProperty("week")
                      )
                      .map((post) => post.week)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index
                      )
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
            }
          })}
      </div>
    );
  }
}
