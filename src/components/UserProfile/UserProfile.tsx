import React, { useContext, useEffect, useState } from "react";
import styles from "./UserProfile.module.css";
import { Link } from "react-router-dom";
import { pathConstraints } from "../../routes/pathConfig";
import { globalContext } from "../../providers/GlobalProvider";

const UserProfile: React.FC = () => {
  const { handleLogOut, currentUserDetails } = useContext(globalContext);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const refreshToken = localStorage.getItem("refreshToken");

  const handleCurrentUser = () => {
    if (currentUserDetails && JSON.stringify(currentUserDetails) !== "{}") {
      setCurrentUser(currentUserDetails);
    }
  };

  useEffect(() => {
    if (!currentUser) handleCurrentUser();
  }, [currentUserDetails]);

  console.log("header", currentUserDetails, currentUser);

  return (
    <div className={styles.UserProfileContainer}>
      <p className={styles.userName}>
        {refreshToken ? currentUser?.userName : "Not Signed In"}
      </p>
      {refreshToken ? (
        <>
          <Link
            className={styles.menus}
            to={`${pathConstraints.SIGNUP}/${currentUser?.id}?isUpdate=true`}
          >
            Update Profile
          </Link>
          <a className={styles.menus} onClick={handleLogOut}>
            Logout
          </a>
        </>
      ) : (
        <>
          <Link to={pathConstraints.SIGNIN} className={styles.menus}>
            Sign in
          </Link>
          <Link to={pathConstraints.SIGNUP} className={styles.menus}>
            Sign up
          </Link>
        </>
      )}
    </div>
  );
};

export default UserProfile;
