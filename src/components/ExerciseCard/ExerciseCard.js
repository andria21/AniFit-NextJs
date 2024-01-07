import React from "react";

import styles from "./exercise-card.module.css";

export default function ExerciseCard({
  videoUrl,
  videoTitle,
  videoDesc,
  videoContent,
  videoDay,
  deleteFunc,
  deleteId,
  objectId,
  isAdmin
}) {
  return (
    <div class={styles.card}>
      <div class={styles.videoWrapper}>
        <iframe
          className={styles.video}
          allowfullscreen
          frameborder="0"
          width="500"
          height="400"
          type="text/html"
          src={`https://www.youtube.com/embed/${videoUrl}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
        ></iframe>
      </div>
      <div class={styles.cardContent}>
        <h1 class={styles.videoTitle}>{videoTitle}</h1>
        <h2 class={styles.videoDescription}>{videoDesc}</h2>
        <h2 class={styles.videoContent}>{videoContent}</h2>
        <h2 class={styles.videoContent}>{videoDay}</h2>
        {isAdmin && <span className={styles.delete} onClick={() => deleteFunc(deleteId, objectId)}>Delete</span>}
      </div>
    </div>
  );
}
