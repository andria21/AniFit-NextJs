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

import Spinner from "@/components/spinner/Spinner";

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
  const [isPostModalOpen, setIsPostModalOpen] = useState(null);

  // cart modal
  const handleCartIconClick = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  //post modal
  const handlePostModalclick = (id) => {
    setIsPostModalOpen(id);
  };
  const closePostModal = () => {
    setIsPostModalOpen(null);
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
    return <div className={styles.spinnerContainer}><Spinner /></div>;
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
    const playlist = e.target[4].value;

    try {
      await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          playlist,
          posts: {
            title,
            desc,
            img,
            content,
            username: session.data.user.name,
          },
        }),
      });
      mutate();
      e.target.reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id, objId) => {
    try {
      await fetch(`/api/posts/${id}/posts/${objId}`, {
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handlePlaylistDelete = async (id) => {
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
    const day = e.target[1].value;
    const week = e.target[2].value;
    const description = e.target[3].value;

    try {
      await fetch("/api/exercises", {
        method: "POST",
        body: JSON.stringify({
          username,
          day,
          week,
          description,
          exercises: array,
        }),
      });
      mutate();
      e.target.reset();
      while (array.length > 0) {
        array.pop();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditExerciseDescription = async (e, postId, exerciseId) => {
    e.preventDefault();
    const title = e.target[0].value;
    const description = e.target[1].value;
    const content = e.target[2].value;
    try {
      await fetch(`/api/posts/${postId}/posts/${exerciseId}`, {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          content,
        }),
      });
      mutate();
      e.target.reset();
    } catch (err) {
      console.log(err);
    }
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
              ? <Spinner />
              : data?.map((post, index) => (
                  <div className={styles.playlistContainer} key={post._id}>
                    <div className={styles.playlistTitleContaner}>
                      <h1
                        className={styles.playlistTitle}
                        onClick={() => handlePostModalclick(index)}
                      >
                        {post.playlist}
                      </h1>
                      <span
                        className={styles.playlistDelete}
                        onClick={() => handlePlaylistDelete(post._id)}
                      >
                        <Image className={styles.exx} src={X} alt="plus" />
                      </span>
                    </div>

                    {isPostModalOpen === index && (
                      <div
                        className={styles.postModalOverlay}
                        onClick={closePostModal}
                      >
                        <div
                          className={styles.postModalContent}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h1 className={styles.modalTitle}>
                            -{post.playlist}-
                          </h1>
                          <span
                            className={styles.exitModal}
                            onClick={closePostModal}
                          >
                            CLOSE
                          </span>
                          {post.posts.map((exe) => (
                            <div className={styles.post} key={exe._id}>
                              <div className={styles.videoWrapper}>
                                <iframe
                                  allowFullScreen
                                  frameBorder="0"
                                  width="350"
                                  height="250"
                                  type="text/html"
                                  className={styles.video}
                                  sandbox
                                  src={`https://www.youtube.com/embed/${exe.img}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
                                ></iframe>
                                <div className={styles.icons}>
                                  <span
                                    className={`${styles.delete} ${styles.plusButton}`}
                                    onClick={() =>
                                      handleDelete(post._id, exe._id)
                                    }
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
                                    className={`${styles.delete} ${styles.plusButton}`}
                                    onClick={() => handleAdd(exe)}
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
                              <div
                                className={styles.videoContent}
                                key={exe._id}
                              >
                                <h2 className={styles.postTitle}>
                                  {exe.title}
                                </h2>
                                <h2 className={styles.postDescription}>
                                  {exe.desc}
                                </h2>
                                <h2 className={styles.postContent}>
                                  {exe.content}
                                </h2>
                                <form
                                  onSubmit={(e) =>
                                    handleEditExerciseDescription(
                                      e,
                                      post._id,
                                      exe._id
                                    )
                                  }
                                  className={styles.editform}
                                >
                                  <h3 className={styles.editHeading}>Update</h3>
                                  <input
                                    type="text"
                                    placeholder="Title..."
                                    className={styles.editInput}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Description..."
                                    className={styles.editInput}
                                  />
                                  <textarea
                                    type="text"
                                    placeholder="Content..."
                                    className={styles.editInput}
                                  />
                                  <button className={styles.editButton}>
                                    Submit
                                  </button>
                                </form>
                              </div>
                            </div>
                          ))}
                          <span
                            className={styles.exitModal}
                            onClick={closePostModal}
                          >
                            CLOSE
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
          </div>
          <div className={styles.formContainer}>
            <form className={styles.new} onSubmit={handleSubmit}>
              <h1>Add New Post</h1>
              <input type="text" placeholder="Title" className={styles.input} />
              <input
                type="text"
                placeholder="Description"
                className={styles.input}
              />
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
                type="text"
                placeholder="Playlist Name"
                className={styles.input}
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
                      Send workout program to user
                    </h1>
                    <div className={styles.exerciseFormContainer}>
                      <form
                        className={styles.workoutPlanForm}
                        onSubmit={handleExerciseFormSubmit}
                      >
                        <input
                          type="text"
                          placeholder="Username"
                          required
                          className={styles.workoutInput}
                        />
                        <input
                          type="number"
                          placeholder="Day"
                          required
                          className={styles.workoutInput}
                        />
                        <input
                          type="number"
                          placeholder="Week"
                          required
                          className={styles.workoutInput}
                        />
                        <textarea
                          type="text"
                          placeholder="Description"
                          className={styles.workoutInput}
                        />
                        <button className={styles.buttonn}>SEND</button>
                        <span className={styles.exitModal} onClick={closeModal}>
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
                              <h2>{vid.title}</h2>
                              <iframe
                                allowFullScreen
                                frameBorder="0"
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
                                  width={30}
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
      </div>
    );
  }
};

export default Dashboard;
