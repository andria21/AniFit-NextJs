"use client"

import Image from "next/image";
import React, { useState } from "react";
import CartImage from "../../../public/cart.svg";

import styles from "./cart-button.module.css"

export default function CartButton({ openModal }) {

  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };
  return (
    <div>
      <button className={styles.cartButton}>
        <Image
          src={CartImage}
          alt="cart"
          width={70}
          height={70}
          className={styles.svg}
          onClick={openModal}
        />
      </button>
      {isAnimating && (
        <div
          className={styles.popAnimation}
          onAnimationEnd={handleAnimationEnd}
        >
          <Image
            src={CartImage}
            alt="cart"
            width={70}
            height={70}
            className={styles.svgg}
            onClick={openModal}
          />
        </div>
      )}
    </div>
  );
}
