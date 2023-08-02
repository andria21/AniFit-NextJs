import Image from "next/image";
import styles from "./page.module.css";
import Lofi from "public/lofi.jpg";
import Button from "@/components/button/Button";
import GymGirl from "../../public/gym-girl.jpg";
import User from "@/models/User";
import Link from "next/link";

import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <div>
      <div className={styles.imgCont}>
        <Image src={GymGirl} alt="aee" className={styles.gymImage} />
        <div className={styles.filter}></div>
        <div className={styles.filter}></div>
        <div className={styles.filter1}>
          <div className={styles.filter1}></div>
          <div className={styles.filter1}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.item}>
            <h1 className={styles.title}>
              Unleash Your <br></br> Inner Athlete
            </h1>
            <p className={styles.desc}>
              We are dedicated to helping you transform your <br />
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
            ducimus aperiam sequi nam quo eveniet voluptatem, numquam tempora
            sit, iusto perspiciatis optio nisi necessitatibus sunt unde.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}