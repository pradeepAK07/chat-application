import React, { useContext, useEffect, useState } from "react";
import { globalContext } from "../providers/GlobalProvider";
import NotFoundPage from "../pages/not-found/NotFoundPage";

interface privateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<privateRouteProps> = ({ children }) => {
  const { currentUserDetails } = useContext(globalContext);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const handleAdminUser = () => {
    if (currentUserDetails && JSON.stringify(currentUserDetails) !== "{}") {
      const roles = currentUserDetails?.userRoles.map((user: any) => {
        return user?.userType;
      });
      setIsAdmin(roles?.includes("ADMIN") || roles?.includes("SUPER_ADMIN"));
    }
  };

  useEffect(() => {
    handleAdminUser();
  }, [currentUserDetails]);

  return isAdmin ? children : <NotFoundPage />;
};

export default PrivateRoute;
