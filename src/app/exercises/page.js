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

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const adminEmail = process.env.ADMIN_EMAIL;

  const { array, isArrayLoading, setIsArrayLoading } = useContext(ExerciseContext);

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
          objects: array,
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
          {isArrayLoading
            ? "loading"
            : array?.map((post) => (
                <div className={styles.post} key={post._id}>
                  <div className={styles.imgContainer}>
                    <iframe
                      allowfullscreen
                      frameborder="0"
                      marginheight="0"
                      marginwidth="0"
                      width="300"
                      height="300"
                      type="text/html"
                      src={`https://www.youtube.com/embed/${post.img}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
                    ></iframe>
                  </div>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <h2 onClick={handleAddToCart} className={styles.postTitle}>
                    {post.username}
                  </h2>
                  <span
                    className={styles.delete}
                    onClick={() => {
                      array.splice(
                        array.findIndex((a) => a._id === post._id),
                        1
                      );
                      setIsArrayLoading(true);
                      setTimeout(() => {
                        setIsArrayLoading(false);
                      }, 100)
                    }}
                  >
                  <Image className={styles.ex} src={X} width={20} height={20} alt="plus" />
                  </span>
                </div>
              ))}
        </div>
        <form className={styles.new} onSubmit={handleSubmit}>
          <h1>Add workout program for a user</h1>
          <input type="text" placeholder="Username" className={styles.input} />
          <button className={styles.button}>SEND</button>
        </form>
      </div>
    );
  } else if (
    session.status === "authenticated" &&
    session.data.user.email !== adminEmail
  ) {
    return (
      <div className={styles.mainDiv}>
        {data?.map((post) => {
          return (
            session.data.user.name === post.username &&
            post?.objects.map((pp) => {
              return (
                <div key={pp._id}>
                  <div class={styles.card}>
                    <div class={styles.videoWrapper}>
                      <iframe
                        className={styles.video}
                        allowfullscreen
                        frameborder="0"
                        width="500"
                        height="400"
                        type="text/html"
                        src={`https://www.youtube.com/embed/${pp.img}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
                      ></iframe>
                    </div>
                    <div class={styles.cardContent}>
                      <h2 class={styles.videoTitle}>{pp.title}</h2>
                      <p class={styles.videoDescription}>{pp.desc}</p>
                      <p class={styles.videoContent}>{pp.content}</p>
                    </div>
                  </div>
                </div>
              );
            })
          );
        })}
      </div>
    );
  }
}