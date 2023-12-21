"use client";

import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import useSWR from "swr";

import styles from "./page.module.css";
import Image from "next/image";
import { NextResponse } from "next/server";

import { ExerciseContext } from "@/context/ExerciseContext";

import CartImage from "../../../public/cart.svg";
import X from "../../../public/x.svg";

import Footer from "@/components/footer/Footer";

import ExerciseCard from "@/components/ExerciseCard/ExerciseCard";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const adminEmail = process.env.ADMIN_EMAIL;

  const { array, isArrayLoading, setIsArrayLoading } =
    useContext(ExerciseContext);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const daysLoop = (name, value) => {
    for (let i = 0; i <= 7; i++) {
      return (
        <h1>
          {name}: {value}
        </h1>
      );
    }
  };
  const arr = [];
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const dataUserName = session?.data?.user.name;
  const { data, mutate, error, isLoading } = useSWR(`/api/exercises`, fetcher);

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "unauthenticated") {
    router?.push("/dashboard/login");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target[0].value;

    try {
      await fetch("/api/exercises", {
        method: "POST",
        body: JSON.stringify({
          username,
          dayOne: array,
          dayTwo: array,
          dayThree: array,
          dayFour: array,
          dayFive: array,
          daySix: array,
          daySeven: array,
        }),
      });
      mutate();
      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id, objId) => {
    try {
      await fetch(`/api/exercises/${id}/exercises/${objId}`, {
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteExerciseUser = async (id) => {
    try {
      await fetch(`/api/exercises/${id}`, {
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = () => {
    setIsAnimating(true);
  };

  const organizedData = data?.reduce((acc, exercise) => {
    const username = exercise.username;
    if (!acc[username]) {
      acc[username] = [];
    }
    acc[username].push(exercise);

    return acc;
  }, {});

  if (
    session.status === "authenticated" &&
    session.data.user.email === adminEmail
  ) {
    return (
      <div className={styles.container}>
        <div className={styles.posts}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            Object.keys(organizedData)?.map((username) => (
              <div className={styles.mainContainer} key={username}>
                <h1 className={styles.userName}>{username}</h1>
                {organizedData[username].map((exercise) => {
                  return exercise.exercises.map((item) => {
                    return (
                      <div className={styles.post} key={item._id}>
                        <span
                          onClick={() => handleDeleteExerciseUser(exercise._id)}
                          style={{
                            color: "red",
                            marginLeft: "16px",
                            fontSize: "16px",
                            cursor: "pointer",
                          }}
                        >
                          Delete All
                        </span>
                        <div className={styles.videoWrapper}>
                          <iframe
                            allowFullscreen
                            frameborder="0"
                            width="350"
                            height="250"
                            className={styles.video}
                            type="text/html"
                            src={`https://www.youtube.com/embed/${item.img}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
                          ></iframe>
                        </div>
                        <div className={styles.info}>
                          <h2 className={styles.postTitle}>
                            Week: {exercise.week}
                          </h2>
                          <h2 className={styles.postTitle}>
                            Day: {exercise.day}
                          </h2>
                          <p className={styles.postTitle}>
                            Description: {exercise.description}
                          </p>
                          <h2 className={styles.postTitle}>
                            Title: {item.title}
                          </h2>
                          <h2 className={styles.postTitle}>
                            Description: {item.desc}
                          </h2>
                          <h2 className={styles.postTitle}>
                            Content: {item.content}
                          </h2>
                          <span
                            className={styles.delete}
                            onClick={() => handleDelete(exercise._id, item._id)}
                          >
                            <Image
                              className={styles.ex}
                              src={X}
                              width={35}
                              height={35}
                              alt="plus"
                            />
                          </span>
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            ))
          )}
        </div>
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
