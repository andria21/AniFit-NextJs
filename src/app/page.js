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
              src="https://images.pexels.com/photos/7200651/pexels-photo-7200651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              width={600}
              height={400}
              alt="image"
              className={styles.bigImage}
            />
            <h1>AniFit</h1>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit nobis distinctio sapiente. Autem illo repellendus vero, cupiditate quae quaerat eligendi quam dolores impedit ducimus quo asperiores ex, libero amet excepturi.</p>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1625152034794-fbe874cb0a37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
            width={200}
            height={400}
            alt="image"
            className={styles.smallImage}
          />
          <Image
            src="https://images.pexels.com/photos/1608099/pexels-photo-1608099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            width={200}
            height={400}
            alt="image"
            className={styles.smallImage}
          />
          <Image
            src="https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80"
            width={200}
            height={400}
            alt="image"
            className={styles.smallImage}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
