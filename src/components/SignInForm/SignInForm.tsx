import React, { useEffect } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./SignInForm.module.css";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { USER_SIGNIN } from "../../queries/userQuery";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { pathConstraints } from "../../routes/pathConfig";

interface signInSubmitForm {
  userName: string;
  password: string;
}

const SignInForm: React.FC = () => {
  const validationSchemaForSignIn = Yup.object().shape({
    userName: Yup.string().required("Username is required").trim(),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_+}\[\]\{":;'’?><,./\\\|=-])[A-Za-z\d~`!@#$%^&*()_+}\[\]\{":;'’?><,./\\\|=-]{8,}$/,
        "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      )
  });
  const navigate = useNavigate();

  const {
    register,
    // reset,
    handleSubmit,
    formState: { errors }
  } = useForm<signInSubmitForm>({
    mode: "all",
    resolver: yupResolver(validationSchemaForSignIn)
  });

  const [userSignIn] = useMutation(USER_SIGNIN);

  const signInFormSubmit = async (formVariables: any) => {
    try {
      const result = await userSignIn({
        variables: {
          userName: formVariables.userName,
          password: formVariables.password
        }
      });
      // Store tokens if sign-in is successful
      if (result?.data) {
        localStorage.setItem("jwtToken", result?.data?.userSignIn?.accessToken);
        localStorage.setItem(
          "refreshToken",
          result?.data.userSignIn.refreshToken
        );
        localStorage.setItem(
          "userId",
          result?.data.userSignIn?.userDetails?.id
        );
        navigate(pathConstraints.HOME);
      }
    } catch (err) {
      console.error("Sign-in error:", err);
    }
  };

  return (
    <div className={styles.signInFormContainer}>
      <form
        className={styles.formContainer}
        onSubmit={handleSubmit(signInFormSubmit)}
      >
        <h2 className={styles.formHeading}>Sign In</h2>
        <div className={styles.inputContainer}>
          <label className={styles.formLabel}>User name</label>
          <input
            className={styles.formInput}
            type="text"
            {...register("userName")}
          />
          {errors?.userName && (
            <span className={styles.formError}>
              {errors?.userName?.message}
            </span>
          )}
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.formLabel}>Password</label>
          <input
            className={styles.formInput}
            type="password"
            {...register("password")}
          />
          {errors?.password && (
            <span className={styles.formError}>
              {errors?.password?.message}
            </span>
          )}
        </div>
        <button className={styles.submitBtn} type="submit">
          Sign in
        </button>
        <p className={styles.infoSignInForm}>
          Don't have an account, Please &nbsp;
          <Link to={pathConstraints.SIGNUP} className={styles.link}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignInForm;
