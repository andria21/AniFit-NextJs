import React from "react";

import styles from "./exercise-card.module.css";
import Image from "next/image";
import Form from "../form-component/Form";

export default function ExerciseCard({
  videoUrl,
  videoTitle,
  videoDesc,
  videoContent,
  videoDay,
  deleteFunc,
  deleteId,
  objectId,
  isAdmin,
  handleExerciseModalclick,
  id,
  isExerciseModalOpen,
  closeExerciseModal,
  playlistData,
  playlistName,
  setPlaylistName,
  handleExerciseEdit,
  driveImage,
  handleAddDriveImage,
  deleteDriveImage,
}) {
  const handlePlaylistClick = (clickedPlaylist) => {
    if (playlistName === clickedPlaylist) {
      setPlaylistName("");
    } else {
      setPlaylistName(clickedPlaylist);
    }
  };
  return (
    <div className={styles.card}>
      <div className={styles.videoWrapper}>
        <iframe
          className={styles.video}
          allowFullScreen
          frameBorder="0"
          width="500"
          height="400"
          type="text/html"
          src={`https://www.youtube.com/embed/${videoUrl}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
        ></iframe>

        {driveImage && (
          <Image
            src={`https://drive.google.com/uc?export=view&id=${driveImage}`}
            alt="Exercise Photo"
            width={2000}
            height={800}
            className={styles.driveImage}
          />
        )}

        {isAdmin && (
          <div className={styles.driveContainer}>
            {driveImage && (
              <span
                className={styles.deleteImage}
                onClick={() => deleteDriveImage(deleteId, objectId)}
              >
                Delete Image
              </span>
            )}
            <Form
              buttonText="Add"
              urlLabelName={"Image URL"}
              handlerFunction={(e) =>
                handleAddDriveImage(e, deleteId, objectId)
              }
            />
          </div>
        )}
      </div>
      <div className={styles.cardContent}>
        <h1 className={styles.videoTitle}>{videoTitle}</h1>
        <h2 className={styles.videoDescription}>{videoDesc}</h2>
        <h2 className={styles.videoContent}>{videoContent}</h2>
        <h2 className={styles.videoContent}>{videoDay}</h2>
        <div className={styles.buttonsContainer}>
          {isAdmin && (
            <span
              className={styles.delete}
              onClick={() => deleteFunc(deleteId, objectId)}
            >
              Delete
            </span>
          )}
          {isAdmin && (
            <span
              className={styles.editSpan}
              onClick={() => handleExerciseModalclick(id)}
            >
              Edit
            </span>
          )}
        </div>
        {isAdmin && isExerciseModalOpen === id && (
          <div
            className={styles.playlistsModalOverlay}
            onClick={closeExerciseModal}
          >
            <div
              className={styles.playlistsModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <span className={styles.close} onClick={closeExerciseModal}>
                CLOSE
              </span>
              <h2 className={styles.sectionHeading}>Choose the PLaylist</h2>
              {playlistData.map((playlist) => (
                <div key={playlist._id}>
                  <h3
                    className={styles.playlistName}
                    onClick={() => handlePlaylistClick(playlist.playlist)}
                  >
                    {playlist.playlist}
                  </h3>
                  {playlist.playlist === playlistName && (
                    <div>
                      {playlist.posts.map((post) => (
                        <div className={styles.post} key={post._id}>
                          <div className={styles.videoWrapper}>
                            <iframe
                              allowFullScreen
                              frameBorder="0"
                              width="300"
                              height="250"
                              type="text/html"
                              className={styles.video}
                              sandbox
                              src={`https://www.youtube.com/embed/${post.img}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
                            ></iframe>
                          </div>
                          <div className={styles.playlistVideoContent}>
                            <h2 className={styles.playlistTitle}>
                              {post.title}
                            </h2>
                            <h2 className={styles.postDescription}>
                              {post.desc}
                            </h2>
                            <h2 className={styles.postContent}>
                              {post.content}
                            </h2>
                            <button
                              className={styles.submitChange}
                              type="submit"
                              onClick={() =>
                                handleExerciseEdit(deleteId, objectId, post)
                              }
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
