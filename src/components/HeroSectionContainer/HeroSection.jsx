import Image from "next/image";
import React from "react";
import styles from "./hero-section.module.css"

function HeroSection({ iamgeURL, imageHeading }) {
  return (
    <div className={styles.heroSectionContainer}>
      <Image
        className={styles.sectionImage}
        src={iamgeURL}
        width={5120}
        height={2160}
        alt="Guide"
      />
      <div className={styles.sectionFilter}></div>
      <div className={styles.sectionFilter1}></div>
      <h1 className={styles.sectionHeader}>{imageHeading}</h1>
    </div>
  );
}

export default HeroSection;
