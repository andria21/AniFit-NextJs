"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useContext } from "react";
import { ExerciseContext } from "@/context/ExerciseContext";

import CartSvg from "../../../public/cart.svg";
import PlusSvg from "../../../public/plus.svg";
import X from "../../../public/x.svg";
import Footer from "@/components/footer/Footer";

const Dashboard = () => {
  const session = useSession();

  const router = useRouter();

  const [array, setArray] = useState([]);
  const [workoutDay, setWorkoutDay] = useState();

  const [isLoad, setIsLoad] = useState(true);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  // const API_URL = process.env.API_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCartIconClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const adminEmail = process.env.ADMIN_EMAIL;

  // const { array, isArrayLoading, setIsArrayLoading } =
  //   useContext(ExerciseContext);

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
    const day = e.target[4].value;

    try {
      await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc,
          img,
          content,
          day,
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
    console.log(array);
    setIsLoad(false);
  };

  const handleExerciseFormSubmit = async (e) => {
    e.preventDefault();

    const username = e.target[0].value;

    try {
      await fetch("/api/exercises", {
        method: "POST",
        body: JSON.stringify({
          username,
          day: workoutDay,
          exercises: array,
        }),
      });
      mutate();
      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDay = (e) => {
    setWorkoutDay(e.target.value);
  };
  //<Image src={post.img} alt="" width={300} height={200} />
  if (
    session.status === "authenticated" &&
    session.data.user.email === adminEmail
  ) {
    return (
      <div>
        <div className={styles.mainDiv}>
          <div className={styles.videoCardContainer}>
            {isLoading
              ? "loading"
              : data?.map((post) => (
                  <div className={styles.post} key={post._id}>
                    <div className={styles.videoWrapper}>
                      <iframe
                        allowfullscreen
                        frameborder="0"
                        width="350"
                        height="250"
                        type="text/html"
                        className={styles.video}
                        sandbox
                        src={`https://www.youtube.com/embed/${post.img}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
                      ></iframe>
                      <div className={styles.icons}>
                        <span
                          className={styles.delete}
                          onClick={() => handleDelete(post._id)}
                        >
                          <Image
                            className={styles.ex}
                            src={X}
                            width={25}
                            height={25}
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
                            width={25}
                            height={25}
                            alt="plus"
                          />
                        </span>
                      </div>
                    </div>

                    <div className={styles.videoContent}>
                      <h2 className={styles.postTitle}>{post.title}</h2>
                      <h2 className={styles.postDescription}>{post.desc}</h2>
                      <h2 className={styles.postContent}>{post.content}</h2>
                      <h2 className={styles.postDay}>Day: {post.day}</h2>
                    </div>
                  </div>
                ))}
          </div>
          <div className={styles.formContainer}>
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
              <input
                type="number"
                placeholder="Day"
                required
                className={styles.input}
                onChange={handleDay}
              />
              <button className={styles.buttona}>SEND</button>
            </form>
            <div className={styles.uploadExercisesForm}>
              <Image
                src={CartSvg}
                className={styles.cartImage}
                alt="Cart"
                onClick={handleCartIconClick}
              />
              {isModalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                  <div
                    className={styles.modalContent}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h1 className={styles.workoutsHeading}>
                      Add workout program for the user
                    </h1>
                    <div className={styles.exerciseFormContainer}>
                      <form
                        className={styles.workoutPlanForm}
                        onSubmit={handleExerciseFormSubmit}
                      >
                        <input
                          type="text"
                          placeholder="Username"
                          className={styles.workoutInput}
                        />
                        <button className={styles.buttonn}>SEND</button>
                        <span
                          className={styles.exitModal}
                          onClick={closeModal}
                        >
       
                          CLOSE
                          
                        </span>
                      </form>
                    </div>
                    <div className={styles.workoutsContainer}>
                      {isLoad ? (
                        <p>Please add some items...</p>
                      ) : (
                        array.map((vid) => {
                          return (
                            <div
                              key={vid._id}
                              className={styles.videoContainer}
                            >
                              
                              <h1>{vid.title}</h1>
                              <iframe
                                allowfullscreen
                                frameborder="0"
                                width="160"
                                height="130"
                                type="text/html"
                                className={styles.video}
                                src={`https://www.youtube.com/embed/${vid.img}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
                              ></iframe>
                              <span
                                className={styles.delete}
                                onClick={() => {
                                  array.splice(
                                    array.findIndex((a) => a._id === vid._id),
                                    1
                                  );
                                  setIsLoad(true);
                                  setTimeout(() => {
                                    setIsLoad(false);
                                  }, 100);
                                }}
                              >
                                <Image
                                  className={styles.removeExercise}
                                  src={X}
                                  width={20}
                                  height={20}
                                  alt="plus"
                                />
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
};

export default Dashboard;
