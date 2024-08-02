"use client";

import useSWR from "swr";

import styles from "./page.module.css";
import ExerciseCard from "@/components/ExerciseCard/ExerciseCard";
import { useSession } from "next-auth/react";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import SaveSVG from "../../../../../../public/save-icon.svg";
import Image from "next/image";

export default function AdminDays({ params }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(`/api/exercises`, fetcher);

  const {
    data: playlistData,
    mutate: playlistMutate,
    error: playlistError,
    isLoading: isLoadingPlaylist,
  } = useSWR(`/api/posts`, fetcher);

  const router = useRouter();
  const session = useSession();
  const adminEmail = process.env.ADMIN_EMAIL;

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(null);
  const [playlistName, setPlaylistName] = useState("");

  const handleExerciseModalclick = (id) => {
    setIsExerciseModalOpen(id);
  };
  const closeExerciseModal = () => {
    setIsExerciseModalOpen(null);
  };

  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef(null);

  const handleSaveClick = () => {
    setShowModal(true);
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

  const handleEditExerciseDescription = async (e, exerciseId) => {
    e.preventDefault();
    const description = e.target[0].value;

    try {
      await fetch(`/api/exercises/${exerciseId}`, {
        method: "POST",
        body: JSON.stringify({
          exerciseId,
          description,
        }),
      });
      mutate();
      e.target.reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleExerciseEdit = async (id, objId, post) => {
    try {
      await fetch(`/api/exercises/${id}/exercises/${objId}`, {
        method: "POST",
        body: JSON.stringify({
          post,
          action: "post",
        }),
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  function extractGoogleDriveId(url) {
    const regex = /\/d\/([^\/]+)\/view/;
    const match = url.match(regex);

    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  }

  const handleAddDriveImage = async (e, id, objId) => {
    e.preventDefault();
    const image = e.target[0].value;

    try {
      await fetch(`/api/exercises/${id}/exercises/${objId}`, {
        method: "POST",
        body: JSON.stringify({
          image: extractGoogleDriveId(image),
          action: "image",
        }),
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteDriveImage = async (id, objId) => {
    try {
      await fetch(`/api/exercises/${id}/exercises/${objId}`, {
        method: "POST",
        body: JSON.stringify({
          action: "delete",
        }),
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitPostSave = async (userPosts) => {
    // e.preventDefault();
    const playlist = inputRef.current.value;

    // console.log(playlist);
    // userPosts.map((posty) => {
    //   posty.exercises.map((xxs) => {
    //     console.log(xxs);
    //   });
    // });

    try {
      await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          playlist,
          posts: userPosts.flatMap((mainUserPosts) =>
            mainUserPosts.exercises.map((actualPosts) => ({
              title: actualPosts.title,
              desc: actualPosts.desc,
              img: actualPosts.img,
              content: actualPosts.content,
              username: session.data.user.name,
            }))
          ),
        }),
      });
      mutate();
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (
    session.status === "authenticated" &&
    session.data.user.email === adminEmail
  ) {
    const nameWithoutPercent = params.id.replace(/%20/g, " ");
    const filteredByWeek = !isLoading
      ? data.filter(
          (item) =>
            item.day == params.adminDay &&
            nameWithoutPercent === item.username &&
            params.day == item.week
        )
      : [];

    return (
      <div className={styles.mainDiv}>
        {!isLoading &&
          filteredByWeek.map((post) => {
            return (
              <div className={styles.secondMainDiv} key={post._id}>
                <span
                  className={styles.delete}
                  onClick={() => handleDeleteExerciseUser(post._id)}
                >
                  Delete
                </span>
                <Image
                  src={SaveSVG}
                  width={50}
                  height={50}
                  alt="Save SVG"
                  onClick={handleSaveClick}
                  className={styles.saveSVG}
                />
                {showModal && (
                  <div
                    className={styles.saveModalOverlay}
                    onClick={handleSubmitPostSave}
                  >
                    <div
                      className={styles.saveModalContent}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2>Save the program</h2>
                      <br />
                      <input
                        className={styles.editInput}
                        type="text"
                        placeholder="Enter the program name..."
                        ref={inputRef}
                      />
                      <br />
                      <button
                        className={styles.editButton}
                        onClick={() => handleSubmitPostSave(filteredByWeek)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
                <div className={styles.weekTitle}>
                  <h3>Description:</h3>
                  <p className={styles.postDescription}>{post.description}</p>

                  <form
                    onSubmit={(e) => handleEditExerciseDescription(e, post._id)}
                    className={styles.editform}
                  >
                    <h3 className={styles.editHeading}>
                      Update the description
                    </h3>
                    <textarea
                      type="text"
                      placeholder="New description..."
                      className={styles.editInput}
                    />
                    <button className={styles.editButton}>Submit</button>
                  </form>
                </div>

                {post.exercises.map((workout) => (
                  <ExerciseCard
                    key={workout._id}
                    videoUrl={workout.img}
                    videoTitle={workout.title}
                    videoDesc={workout.desc}
                    videoContent={workout.content}
                    driveImage={workout.driveImage}
                    isAdmin={
                      session.status === "authenticated" &&
                      session.data.user.email === adminEmail
                    }
                    deleteFunc={handleDeleteSingleExercise}
                    deleteId={post._id}
                    objectId={workout._id}
                    handleExerciseModalclick={handleExerciseModalclick}
                    id={workout._id}
                    isExerciseModalOpen={isExerciseModalOpen}
                    closeExerciseModal={closeExerciseModal}
                    playlistData={!isLoadingPlaylist && playlistData}
                    playlistName={playlistName}
                    setPlaylistName={setPlaylistName}
                    handleExerciseEdit={handleExerciseEdit}
                    handleAddDriveImage={handleAddDriveImage}
                    deleteDriveImage={deleteDriveImage}
                  />
                ))}
              </div>
            );
          })}
      </div>
    );
  }
}

// https://drive.google.com/uc?export=view&amp;id=
