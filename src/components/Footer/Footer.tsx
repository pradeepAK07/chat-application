import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <div className={styles.footerContainer}>
      <p className={styles.footerContent}>
        @ 2024 React App , All rights received.
      </p>
    </div>
  );
};

export default Footer;
