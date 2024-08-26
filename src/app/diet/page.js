"use client";

import { useSession } from "next-auth/react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Spinner from "@/components/spinner/Spinner";
import { useState } from "react";
import Form from "@/components/form-component/Form";
import Image from "next/image";
import Footer from "@/components/footer/Footer";

export default function Beginners() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const session = useSession();
  const router = useRouter();

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(`/api/diet`, fetcher);

  const [editForm, setEditForm] = useState(null);

  var isAdmin =
    session.status === "authenticated" &&
    session.data.user.email === adminEmail;

  const handleAddBeginners = async (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const desc = e.target[1].value;
    const image = e.target[2].value;

    try {
      await fetch("/api/diet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc,
          image,
        }),
      });
      mutate();
      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGuide = async (dietId) => {
    try {
      await fetch(`/api/diet/${dietId}`, {
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
    const image = e.target[2].value;

    try {
      await fetch(`/api/diet/${editForm}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc,
          image,
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
      <h1>Diet Plans</h1>
      {isAdmin && (
        <Form
          handlerFunction={handleAddBeginners}
          buttonText={"Add"}
          urlLabelName={"Image URL"}
          title={"Title"}
          desc={"Description"}
        />
      )}

      <div className={styles.beginnersData}>
        {isLoading ? (
          <Spinner />
        ) : (
          data.map((diet) => (
            <div key={diet._id} className={styles.guideContainer}>
              <div className={styles.diet}>
                {isAdmin && (
                  <span
                    className={styles.delete}
                    onClick={() => handleDeleteGuide(diet._id)}
                  >
                    X
                  </span>
                )}
                {diet.image && (
                  <Image
                    src={diet.image}
                    height={100}
                    width={300}
                    className={styles.dietImage}
                  />
                )}
                <h3 className={styles.title}>{diet.title}</h3>
                <p className={styles.guideDesc}>{diet.desc}</p>
                {isAdmin && (
                  <div>
                    <button
                      className={styles.editButton}
                      type="button"
                      onClick={() =>
                        editForm !== diet._id
                          ? setEditForm(diet._id)
                          : setEditForm(null)
                      }
                    >
                      Edit
                    </button>
                    {editForm === diet._id && (
                      <Form
                        title={"Title"}
                        desc={"Description"}
                        handlerFunction={handleEdit}
                        buttonText={"Submit"}
                        urlLabelName={"Image URL"}
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
