import React from "react";
import styles from "./userCard.module.css";
import { useNavigate } from "react-router-dom";

interface UserCardProps {
  userDetails: any;
  currentUserData: any;
}

const UserCard: React.FC<UserCardProps> = ({
  userDetails,
  currentUserData
}) => {
  const navigate = useNavigate();

  const handleNavigate = (userDetails: any) => {
    navigate("/chat", {
      state: { recipientData: userDetails, currentUserData }
    });
  };

  return (
    <div className={styles.userProfileContainer}>
      <p className={styles.userName}>{userDetails.userName}</p>
      <button
        className={styles.button}
        onClick={() => handleNavigate(userDetails)}
      >
        send msg
      </button>
    </div>
  );
};

export default UserCard;
