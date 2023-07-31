"use client";

import { createContext, useState } from "react";

export const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
  const [array, setArray] = useState([]);
  const [isArrayLoading, setIsArrayLoading] = useState(true);

  return (
    <ExerciseContext.Provider
      value={{ array, setArray, isArrayLoading, setIsArrayLoading }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};
