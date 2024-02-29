import Image from "next/image";
import styles from "./page.module.css";
import AnifitMainPhoto from "../../public/main-photo.jpg";
import AniFitBasicPhoto1 from "../../public/anifit1.JPG";
import AniFitBasicPhoto2 from "../../public/anifit1-3.JPG";
import AniFitBasicPhoto3 from "../../public/anifit1-4.JPG";
import AniFitBasicPhoto4 from "../../public/anifit1-5.JPG";
import Link from "next/link";

import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <div>
      <div className={styles.imgCont}>
        <Image src={AnifitMainPhoto} alt="AniFit" className={styles.gymImage} width={"auto"} height={"auto"} />
        <div className={styles.filter}></div>
        <div className={styles.filter}></div>
        <div className={styles.filter1}>
          <div className={styles.filter1}></div>
          <div className={styles.filter1}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.item}>
            <h1 className={styles.title}>
              Unleash Your <br className="bbr"></br> Inner Athlete
            </h1>
            <p className={styles.desc}>
              I am dedicated to helping you transform your <br />
              body and mind trough the power of fitness
            </p>
            <Link href={"/dashboard/register"}>
              <button className={styles.customButton}>JOIN NOW</button>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.secondContainer}>
        <div className={styles.textContainer}>
          <h1>
            Transform Your <br /> Fitness Journey
          </h1>
          <p>
            Conquer fears, build strength, endure, and progress. Believe,
            inspire, focus, and strive. Embrace challenges, no excuses. Rise
            above, celebrate victories. Unleash greatness, ignite passion.
            Achieve, persist, grow. Be the hero
          </p>
        </div>
      </div>
      <div className={styles.thirdContainer}>
        <div className={styles.aboutMeImageContainer}>
          <div>
            <Image
              src={AniFitBasicPhoto1}
              width={600}
              height={400}
              alt="image"
              className={styles.bigImage}
            />
            <h1>AniFit</h1>
            <p>Beauty does not require sacrifice, but regular training.</p>
          </div>
          <Image
            src={AniFitBasicPhoto4}
            width={200}
            height={400}
            alt="image"
            className={styles.smallImage}
          />
          <Image
            src={AniFitBasicPhoto3}
            width={200}
            height={400}
            alt="image"
            className={styles.smallImage}
          />
          <Image
            src={AniFitBasicPhoto2}
            width={200}
            height={400}
            alt="image"
            className={styles.smallImage}
          />
        </div>
      </div>
    </div>
  );
}
