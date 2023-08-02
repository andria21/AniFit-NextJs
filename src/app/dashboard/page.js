"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useContext } from "react";
import { ExerciseContext } from "@/context/ExerciseContext";

import PlusSvg from "../../../public/plus.svg";
import X from "../../../public/x.svg";
import Footer from "@/components/footer/Footer";

const Dashboard = () => {
  const session = useSession();

  const router = useRouter();

  // const API_URL = process.env.API_URL;

  const adminEmail = process.env.ADMIN_EMAIL;

  const { array, isArrayLoading, setIsArrayLoading } =
    useContext(ExerciseContext);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const dataUserName = session?.data?.user.name;
  const { data, mutate, error, isLoading } = useSWR(
    `/api/posts?username=${dataUserName}`,
    fetcher
  );

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "unauthenticated") {
    router?.push("/dashboard/login");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const desc = e.target[1].value;
    const img = e.target[2].value;
    const content = e.target[3].value;

    try {
      await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc,
          img,
          content,
          username: session.data.user.name,
        }),
      });
      mutate();
      e.target.reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = (postToAdd) => {
    array.push(postToAdd);
    // alert("Post has been added to your program!");
    setIsArrayLoading(false);
    console.log(array);
  };
  //<Image src={post.img} alt="" width={300} height={200} />
  if (
    session.status === "authenticated" &&
    session.data.user.email === adminEmail
  ) {
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.posts}>
            {isLoading
              ? "loading"
              : data?.map((post) => (
                  <div className={styles.post} key={post._id}>
                    <div className={styles.imgContainer}>
                      <iframe
                        allowfullscreen
                        frameborder="0"
                        width="300"
                        height="300"
                        type="text/html"
                        src={`https://www.youtube.com/embed/${post.img}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
                      ></iframe>
                    </div>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <span
                      className={styles.delete}
                      onClick={() => handleDelete(post._id)}
                    >
                      <Image
                        className={styles.ex}
                        src={X}
                        width={20}
                        height={20}
                        alt="plus"
                      />
                    </span>
                    <span
                      className={styles.delete}
                      onClick={() => handleAdd(post)}
                    >
                      <Image
                        className={styles.plus}
                        src={PlusSvg}
                        width={20}
                        height={20}
                        alt="plus"
                      />
                    </span>
                  </div>
                ))}
          </div>
          <form className={styles.new} onSubmit={handleSubmit}>
            <h1>Add New Post</h1>
            <input type="text" placeholder="Title" className={styles.input} />
            <input type="text" placeholder="Desc" className={styles.input} />
            <input
              type="text"
              placeholder="Youtube URL"
              className={styles.input}
            />
            <textarea
              placeholder="Content"
              className={styles.textArea}
              cols="30"
              rows="10"
            ></textarea>
            <button className={styles.button}>SEND</button>
          </form>
        </div>
        <Footer />
      </div>
    );
  }
};

export default Dashboard;
