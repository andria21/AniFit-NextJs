import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <div>©2024 AniFit. All rights reserved.</div>
      <div className={styles.social}>
        <Link href={"https://www.facebook.com/ani.margieva"}>
          <Image
            src="/1.png"
            width={20}
            height={20}
            className={styles.icon}
            alt="AniFit"
          />
        </Link>
        <Link
          href={
            "https://www.instagram.com/_anifit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          }
        >
          <Image
            src="/2.png"
            width={20}
            height={20}
            className={styles.icon}
            alt="AniFit"
          />
        </Link>

        <Link href={"#"}>
          <Image
            src="/4.png"
            width={20}
            height={20}
            className={styles.icon}
            alt="AniFit"
          />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
