"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import PlusSvg from "../../../public/plus.svg";
import X from "../../../public/x.svg";
import MenuSVG from "../../../public/menuSVG.svg";
import RemoveSVG from "../../../public/removeSVG.svg";

import Spinner from "@/components/spinner/Spinner";

import CloseSVG from "../../../public/closeSVG.svg";
import SearchExercise from "@/components/Exercise-SearchBar/SearchExercise";

const Dashboard = () => {
  const session = useSession();

  const router = useRouter();

  const [array, setArray] = useState([]);
  const [workoutDay, setWorkoutDay] = useState();
  const [fullDescription, setFullDescription] = useState("");

  const [isLoad, setIsLoad] = useState(true);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  // const API_URL = process.env.API_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(null);
  const [searchInput, setSearchInput] = useState("");

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

  const excludedPlaylists = [
    "ფეხები",
    "მკერდი",
    "ზურგი",
    "დელტები",
    "ბიცეპსი",
    "ტრიცეპსი",
    "დუნდულები",
    "abs",
  ];

  // const { array, isArrayLoading, setIsArrayLoading } =
  //   useContext(ExerciseContext);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const dataUserName = session?.data?.user.name;
  const { data, mutate, error, isLoading } = useSWR(
    `/api/posts?username=${dataUserName}`,
    fetcher
  );

  if (session.status === "loading") {
    return (
      <div className={styles.spinnerContainer}>
        <Spinner />
      </div>
    );
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

  const handleAddAll = (postData) => {
    postData.map((test) => {
      console.log(test);
      array.push(test);
    });
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
            <h1>Playlists</h1>
            {isLoading ? (
              <Spinner />
            ) : (
              data?.map((post, index) => (
                <div className={styles.playlistContainer} key={post._id}>
                  <div className={styles.playlistTitleContaner}>
                    <h1
                      className={styles.playlistTitle}
                      onClick={() => handlePostModalclick(index)}
                    >
                      {post.playlist}
                    </h1>
                  </div>
                  <span
                    className={styles.playlistDelete}
                    onClick={() => handlePlaylistDelete(post._id)}
                  >
                    {!excludedPlaylists.includes(post.playlist) && (
                      <Image
                        src={CloseSVG}
                        width={35}
                        height={35}
                        alt="Close SVG"
                        className={styles.closeSVG}
                      />
                    )}
                  </span>

                  {isPostModalOpen === index && (
                    <div
                      className={styles.postModalOverlay}
                      onClick={closePostModal}
                    >
                      <div
                        className={styles.postModalContent}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h1 className={styles.modalTitle}>-{post.playlist}-</h1>
                        <span
                          className={styles.exitModal}
                          onClick={closePostModal}
                        >
                          <Image
                            src={CloseSVG}
                            width={35}
                            height={35}
                            alt="Close SVG"
                            className={styles.closeSVG}
                          />
                        </span>

                        <SearchExercise
                          searchInput={searchInput}
                          setSearchInput={setSearchInput}
                        />

                        {!excludedPlaylists.includes(post.playlist) && (
                          <>
                            <button
                              className={styles.addAllButton}
                              onClick={() => {
                                handleAddAll(post.posts.map((exes) => exes));
                                setFullDescription(
                                  post.fullDescriptions.map((fd) => fd)
                                );
                                closePostModal();
                              }}
                            >
                              Add All
                            </button>
                            <h4 className={styles.modalTitle}>
                              Full Description
                            </h4>
                          </>
                        )}

                        {post.fullDescriptions &&
                          post.fullDescriptions.map((fullDesc) => (
                            <div key={post._id} className={styles.fullDescDiv}>
                              <p className={styles.fullDescP}>{fullDesc}</p>
                            </div>
                          ))}

                        {post.posts
                          .filter((exe) =>
                            exe.title
                              .toLowerCase()
                              ?.includes(searchInput.toLowerCase())
                          )
                          .map((exe) => (
                            <div className={styles.post} key={exe._id}>
                              <div className={styles.videoWrapper}>
                                <iframe
                                  allowFullScreen
                                  frameBorder="0"
                                  width="350"
                                  height="250"
                                  type="text/html"
                                  className={styles.postVideo}
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
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
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
            <div>
              <Image
                src={MenuSVG}
                className={styles.cartImage}
                alt="Cart"
                onClick={handleCartIconClick}
                width={60}
                height={60}
              />
              {isModalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                  <div
                    className={styles.modalContent}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h1 className={styles.workoutsHeading}>
                      Send a workout program to the user
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
                          value={fullDescription && fullDescription}
                          onChange={(e) => setFullDescription(e.target.value)}
                        />
                        <button className={styles.buttonn}>SEND</button>
                        <span className={styles.exitModal} onClick={closeModal}>
                          <Image
                            src={CloseSVG}
                            width={35}
                            height={35}
                            alt="Close SVG"
                            className={styles.closeSVG}
                          />
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
                              <h2 className={styles.cartVideoTitle}>
                                {vid.title}
                              </h2>
                              <iframe
                                allowFullScreen
                                frameBorder="0"
                                width="240"
                                height="150"
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
                                  src={RemoveSVG}
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
      </div>
    );
  }
};

export default Dashboard;
