"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const questionsList = ["Age", "Weight (kg)", "Height (cm)", "Pulse"];

const QuizForm = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [formData, setFormData] = useState({});

  const session = useSession();
  const router = useRouter();

  const handleNextQuestion = () => {
    if (questionIndex < questionsList.length - 1) {
      setQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the form data, like sending it to a server
    console.log("Form Data:", formData);
    // Optionally, you can reset the form after submission
    setFormData({});
    setQuestionIndex(0); // Reset back to the first question
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return session.status === "unauthenticated" ? (
    router.push("/dashboard/register")
  ) : (
    <div className={styles["quiz-container"]}>
      <form className={styles["quiz-form"]} onSubmit={handleSubmit}>
        <h2>Quiz Form</h2>
        {questionIndex < questionsList.length && (
          <>
            <label>
              {questionsList[questionIndex]}:
              <input
                type="text"
                value={formData[questionIndex] || ""}
                onChange={handleChange}
                name={questionIndex.toString()}
                required
              />
            </label>

            {questionIndex !== questionsList.length - 1 && (
              <button type="button" onClick={handleNextQuestion}>
                Next
              </button>
            )}
          </>
        )}

        {questionIndex === questionsList.length - 1 && (
          <button type="submit">Submit</button>
        )}
      </form>
    </div>
  );
};

export default QuizForm;
