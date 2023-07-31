import React from "react";
import styles from "./modal.module.css";

const MediumModal = ({ isOpen, onClose, handleSubmit }) => {
  if (!isOpen) return null;

  return (
    <form className={styles.new} onSubmit={handleSubmit}>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <h1>Send workout program to user</h1>
          <input type="text" placeholder="Username" className={styles.input} />
          <button onClick={onClose} className={styles.button}>Send</button>
        </div>
      </div>
    </form>
  );
};

export default MediumModal;
