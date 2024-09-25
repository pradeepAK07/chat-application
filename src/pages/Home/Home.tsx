import React from "react";
import styles from "./Home.module.css";
import AllUsers from "../../components/AllUsers/AllUsers";

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <AllUsers />
    </div>
  );
};

export default Home;
