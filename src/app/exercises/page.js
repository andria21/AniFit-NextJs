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

  const handleDelete = async (id) => {
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
            data.map((item) => (
              <div className={styles.mainContainer} key={item.id}>
                <h1 className={styles.userName}>{item.username}</h1>
                {item.exercises?.map((workout) => (
                  <div className={styles.post} key={workout._id}>
                    <div className={styles.imgContainer}>
                      <iframe
                        allowfullscreen
                        frameborder="0"
                        marginheight="0"
                        marginwidth="0"
                        width="300"
                        height="300"
                        type="text/html"
                        src={`https://www.youtube.com/embed/${workout.img}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
                      ></iframe>
                    </div>
                    <div className={styles.info}>
                      <h2 className={styles.postTitle}>{workout.title}</h2>
                      <span
                        className={styles.delete}
                        onClick={() => handleDelete(workout._id)}
                      >
                        <Image
                          className={styles.ex}
                          src={X}
                          width={20}
                          height={20}
                          alt="plus"
                        />
                      </span>
                    </div>
                  </div>
                ))}
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
            const sortedExercises = post.exercises.flat()
            .sort((a, b) => a.week - b.week)
              .sort((a, b) => a.day - b.day)
            
            return (
              <>
                {sortedExercises?.map((workout) => (
                  <ExerciseCard
                    key={workout._id}
                    videoUrl={workout.img}
                    videoTitle={workout.title}
                    videoDesc={workout.desc}
                    videoContent={workout.content}
                  />
                ))}
              </>
            );
          }
        })}
        <Footer />
      </div>
    );
  }
}
