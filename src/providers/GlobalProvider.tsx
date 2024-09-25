import { useLazyQuery } from "@apollo/client";
import React, { createContext, useEffect, useState } from "react";
import { GET_CURRENT_USER } from "../queries/userQuery";

interface providerProps {
  children: React.ReactNode;
}

export const globalContext = createContext<any>(null);

const GlobalProvider: React.FC<providerProps> = ({ children }) => {
  const [currentUserDetails, setCurrentUserDetails] = useState<any>({});

  const [handleCurrentUser] = useLazyQuery(GET_CURRENT_USER, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setCurrentUserDetails(data?.getCurrentUser);
    },
    onError: (err) => {
      console.log("current user details error", err.message);
    }
  });

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const handleLogOut = () => {
    localStorage.clear();
    setCurrentUserDetails(null);
  };

  return (
    <globalContext.Provider value={{ currentUserDetails, handleLogOut }}>
      {children}
    </globalContext.Provider>
  );
};

export default GlobalProvider;
