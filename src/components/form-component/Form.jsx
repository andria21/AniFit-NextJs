import styles from "./form.module.css";

export default function Form({
  handlerFunction,
  buttonText,
  urlLabelName,
  title,
  desc,
}) {
  return (
    <form className={styles.adminInputsContainer} onSubmit={handlerFunction}>
      {title && (
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            {title}:
          </label>
          <input type="text" id="title" name="title" className={styles.input} />
        </div>
      )}
      {desc && (
        <div className={styles.formGroup}>
          <label htmlFor="desc" className={styles.label}>
            {desc}:
          </label>
          <textarea
            type="text"
            id="desc"
            name="desc"
            className={styles.input}
          />
        </div>
      )}
      <div className={styles.formGroup}>
        <label htmlFor="video" className={styles.label}>
          {urlLabelName}:
        </label>
        <input type="text" id="video" name="video" className={styles.input} />
      </div>
      <button className={styles.submitButton} type="submit">
        {buttonText}
      </button>
    </form>
  );
}
