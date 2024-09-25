import React, { useEffect, useState } from "react";
import styles from "./AllUsers.module.css";
import UserCard from "./UserCard/UserCard";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_USERS, GET_CURRENT_USER } from "../../queries/userQuery";

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<any>([]);
  const [currentUserData, setCurrentUserData] = useState<any>({});

  const [getAllUsers] = useLazyQuery(GET_ALL_USERS, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setUsers(data.getAllUsers);
    },
    onError: (err) => {
      console.log(err);
    }
  });

  const [handleCurrentUser] = useLazyQuery(GET_CURRENT_USER, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setCurrentUserData(data?.getCurrentUser);
    },
    onError: (err) => {
      console.log("current user details error", err.message);
    }
  });

  useEffect(() => {
    getAllUsers();
    handleCurrentUser();
  }, []);

  return (
    <div className={styles.allUsersContainer}>
      <h1 className={styles.heading}>All Users List</h1>
      <div className={styles.allUsersList}>
        {users.map((user: any, i: number) => {
          if (currentUserData?.userName !== user?.userName) {
            return (
              <UserCard
                userDetails={user}
                currentUserData={currentUserData}
                key={i}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default AllUsers;
