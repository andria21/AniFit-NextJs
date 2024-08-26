"use client";

import { useSession } from "next-auth/react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Spinner from "@/components/spinner/Spinner";
import { useState } from "react";
import Form from "@/components/form-component/Form";
import Footer from "@/components/footer/Footer";

export default function Beginners() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const session = useSession();
  const router = useRouter();

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(`/api/beginners`, fetcher);

  const [editForm, setEditForm] = useState(null);

  var isAdmin =
    session.status === "authenticated" &&
    session.data.user.email === adminEmail;

  const handleAddBeginners = async (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const desc = e.target[1].value;
    const video = e.target[2].value;

    try {
      await fetch("/api/beginners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc,
          video,
        }),
      });
      mutate();
      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGuide = async (guideId) => {
    try {
      await fetch(`/api/beginners/${guideId}`, {
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const desc = e.target[1].value;
    const video = e.target[2].value;

    try {
      await fetch(`/api/beginners/${editForm}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc,
          video,
        }),
      });
      mutate();
      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1>Guide&apos;s for Beginners</h1>
        {isAdmin && (
          <Form
            handlerFunction={handleAddBeginners}
            buttonText={"Add"}
            urlLabelName={"Video URL"}
            title={"Title"}
            desc={"Description"}
          />
        )}

        <div className={styles.beginnersData}>
          {isLoading ? (
            <Spinner />
          ) : (
            data.map((guide) => (
              <div key={guide._id} className={styles.guideContainer}>
                <div className={styles.guide}>
                  {isAdmin && (
                    <span
                      className={styles.delete}
                      onClick={() => handleDeleteGuide(guide._id)}
                    >
                      X
                    </span>
                  )}
                  {guide.video && (
                    <div className={styles.videoWrapper}>
                      <iframe
                        className={styles.video}
                        allowFullScreen
                        frameBorder="0"
                        width="500"
                        height="400"
                        type="text/html"
                        src={`https://www.youtube.com/embed/${guide.video}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
                      ></iframe>
                    </div>
                  )}
                  <h3 className={styles.title}>{guide.title}</h3>
                  <p className={styles.guideDesc}>{guide.desc}</p>
                  {isAdmin && (
                    <div>
                      <button
                        className={styles.editButton}
                        type="button"
                        onClick={() =>
                          editForm !== guide._id
                            ? setEditForm(guide._id)
                            : setEditForm(null)
                        }
                      >
                        Edit
                      </button>
                      {editForm === guide._id && (
                        <Form
                          handlerFunction={handleEdit}
                          buttonText={"Submit"}
                          urlLabelName={"Video URL"}
                          title={"Title"}
                          desc={"Description"}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
