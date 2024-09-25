import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import styles from "./SignUpForm.module.css";
import { useMutation } from "@apollo/client";
import { USER_SIGNUP } from "../../queries/userQuery";
import { Link, useNavigate } from "react-router-dom";
import { pathConstraints } from "../../routes/pathConfig";

interface signUpSubmitForm {
  firstName: string;
  lastName?: string;
  userName: string;
  password: string;
  confirm_password: string;
}

const SignUpForm: React.FC = () => {
  const validationSchemaForSignUp: any = Yup.object().shape({
    firstName: Yup.string().required("first name is required").trim(),
    lastName: Yup.string().trim().optional(),
    userName: Yup.string().required("username is required").trim(),
    password: Yup.string()
      .required("password is required")
      .trim()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_+}\[\]\{":;'’?><,./\\\|=-])[A-Za-z\d~`!@#$%^&*()_+}\[\]\{":;'’?><,./\\\|=-]{8,}$/,
        "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirm_password: Yup.string()
      .required("Confirm password is required")
      .oneOf(
        [Yup.ref("password")],
        "Confirm password must match with given password"
      )
      .trim()
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<signUpSubmitForm>({
    mode: "all",
    resolver: yupResolver(validationSchemaForSignUp)
  });
  const navigate = useNavigate();
  const [userSignUp] = useMutation(USER_SIGNUP);

  const signUpFormSubmit = async (formVariables: any) => {
    try {
      const result = await userSignUp({
        variables: {
          createUserInput: {
            firstName: formVariables.firstName,
            lastName: formVariables.lastName,
            userName: formVariables.userName,
            password: formVariables.password
          }
        }
      });
      // Store tokens if sign-in is successful
      if (result?.data) {
        localStorage.setItem("jwtToken", result?.data?.userSignUp?.accessToken);
        localStorage.setItem(
          "refreshToken",
          result?.data.userSignUp.refreshToken
        );
        localStorage.setItem(
          "userId",
          result?.data.userSignUp?.userDetails?.id
        );
        navigate(pathConstraints.HOME);
      }
    } catch (err: any) {
      console.error("Signup error:", err?.message);
    }
  };

  return (
    <div className={styles.signUpFormContainer}>
      <form
        className={styles.formContainer}
        onSubmit={handleSubmit(signUpFormSubmit)}
      >
        <h2 className={styles.formHeading}>Sign Up</h2>
        <div className={styles.inputContainer}>
          <label className={styles.formLabel}>First Name</label>
          <input
            className={styles.formInput}
            type="text"
            {...register("firstName")}
          />
          {errors?.firstName && (
            <span className={styles.formError}>
              {errors?.firstName?.message}
            </span>
          )}
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.formLabel}>Last Name</label>
          <input
            className={styles.formInput}
            type="text"
            {...register("lastName")}
          />
          {errors?.lastName && (
            <span className={styles.formError}>
              {errors?.lastName?.message}
            </span>
          )}
        </div>
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
        <div className={styles.inputContainer}>
          <label className={styles.formLabel}>Confirm Password</label>
          <input
            className={styles.formInput}
            type="password"
            {...register("confirm_password")}
          />
          {errors?.confirm_password && (
            <span className={styles.formError}>
              {errors?.confirm_password?.message}
            </span>
          )}
        </div>
        <button className={styles.submitBtn} type="submit">
          Sign Up
        </button>
        <p className={styles.infoSignInForm}>
          Already have an account, please{" "}
          <Link to={pathConstraints.SIGNIN} className={styles.link}>
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
