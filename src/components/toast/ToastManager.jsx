import { useState } from "react";
import Toast from "./Toast";
import "./toast.css";

export default function ToastManager() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return {
    addToast,
    element: (
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} />
        ))}
      </div>
    ),
  };
}
