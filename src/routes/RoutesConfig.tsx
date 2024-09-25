import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "../pages/Home/Home";
import SignInPage from "../pages/sign-in/SignInPage";
import SignUpPage from "../pages/sign-up/SignUpPage";
import { pathConstraints } from "./pathConfig";
import AddAdmin from "../components/AddAdmin/AddAdmin";
import PrivateRoute from "./PrivateRoute";
import NotFoundPage from "../pages/not-found/NotFoundPage";
import Layout from "../components/Layout/Layout";
import Chat from "../components/Chat/Chat";

const RoutesConfig: React.FC = () => {
  const routes = useRoutes([
    { path: pathConstraints.NOT_FOUND, element: <NotFoundPage /> },
    {
      path: pathConstraints.HOME,
      element: (
        <Layout>
          <Home />
        </Layout>
      )
    },
    {
      path: pathConstraints.CHAT,
      element: (
        <Layout>
          <Chat />
        </Layout>
      )
    },
    { path: pathConstraints.SIGNIN, element: <SignInPage /> },
    { path: pathConstraints.SIGNUP, element: <SignUpPage /> },
    {
      path: pathConstraints.ADD_ROLE,
      element: (
        <Layout>
          <PrivateRoute>
            <AddAdmin />
          </PrivateRoute>
        </Layout>
      )
    }
  ]);

  return routes;
};

export default RoutesConfig;
