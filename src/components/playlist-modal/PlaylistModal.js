import Image from "next/image";
import React from "react";

export default function PlaylistModal({ prop }) {
  return (
    <div className={styles.postModalOverlay} onClick={closePostModal}>
      <div
        className={styles.postModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.post} key={prop._id}>
          <div className={styles.videoWrapper}>
            <iframe
              allowFullScreen
              frameBorder="0"
              width="350"
              height="250"
              type="text/html"
              className={styles.video}
              sandbox
              src={`https://www.youtube.com/embed/${prop.img}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
            ></iframe>
            <div className={styles.icons}>
              <span
                className={styles.delete}
                onClick={() => handleDelete(prop._id)}
              >
                <Image
                  className={styles.ex}
                  src={X}
                  width={25}
                  height={25}
                  alt="plus"
                />
              </span>
              <span className={styles.delete} onClick={() => handleAdd(post)}>
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
            <h2 className={styles.postTitle}>{prop.title}</h2>
            <h2 className={styles.postDescription}>{prop.desc}</h2>
            <h2 className={styles.postContent}>{prop.content}</h2>
          </div>
        </div>
        <span className={styles.exitModal} onClick={closePostModal}>
          CLOSE
        </span>
      </div>
    </div>
  );
}
