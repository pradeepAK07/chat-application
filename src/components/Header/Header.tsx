import React, { useState } from "react";
import styles from "./Header.module.css";
import { navMenus } from "../../helper/helper";
import { Link } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import UserProfile from "../UserProfile/UserProfile";

const Header: React.FC = () => {
  // const [currentUser, setCurrentUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // const [handleCurrentUser] = useLazyQuery(GET_CURRENT_USER, {
  //   fetchPolicy: "no-cache",
  //   onCompleted: (data) => {
  //     setCurrentUser(data?.getCurrentUser);
  //   },
  //   onError: (err) => {
  //     console.log("current user details error", err.message);
  //   }
  // });

  // useEffect(() => {
  //   if (!currentUser) handleCurrentUser();
  // }, []);

  // const handleLogOut = () => {
  //   localStorage.clear();
  //   setCurrentUser({});
  // };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <h2>User Management</h2>
      </div>
      <div className={styles.menuContainer}>
        {navMenus.map(({ label, path }: { label: string; path: string }) => (
          <Link to={path} className={styles.link} key={label}>
            {label}
          </Link>
        ))}
      </div>
      <div
        className={styles.profileBlock}
        onClick={() => setIsProfileOpen(!isProfileOpen)}
      >
        <FaCircleUser className={styles.profile} />
        {isProfileOpen && <UserProfile />}
      </div>
    </div>
  );
};

export default Header;
