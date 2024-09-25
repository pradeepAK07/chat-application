import React from "react";
import Header from "../../components/Header/Header";
// import Footer from "../../components/Footer/Footer";
import styles from "./SignInPage.module.css";
import SignInForm from "../../components/SignInForm/SignInForm";

const SignInPage: React.FC = () => {
  return (
    <div className={styles.signInContainer}>
      {/* <Header /> */}
      <SignInForm />
      {/* <Footer /> */}
    </div>
  );
};

export default SignInPage;
