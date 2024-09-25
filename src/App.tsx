import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "./routes/RoutesConfig";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import GlobalProvider from "./providers/GlobalProvider";
import fetch from "cross-fetch";
import axios from "axios";

const getAccessToken = async () => {
  const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_REST_API_URL;
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    const result: any = await axios.post(
      `${backendURL}/auth/refresh-token?refreshToken=${refreshToken}`
    );
    localStorage.setItem("jwtToken", result.data?.accessToken);
    return result.data?.accessToken;
  } catch (err: any) {
    console.log("error while fetching access token", err?.message);
  }
};

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_REACT_APP_BACKEND_GRAPHQL_URL,
  fetch
});

const authLink = setContext(async (_, { headers }) => {
  let token = localStorage?.getItem("jwtToken");
  if (token && token !== "undefined" && token.split(".").length > 1) {
    const jwtPayload: any = JSON.parse(window.atob(token?.split(".")[1]));
    const isExpired = Date.now() >= jwtPayload.exp * 1000;

    if (isExpired) {
      token = await getAccessToken();
    }
  }

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const errorLink = onError(({ graphQLErrors, operation, forward }: any) => {
  if (graphQLErrors && graphQLErrors.length) {
    // Check if the token expired
    if (
      graphQLErrors[0]?.extensions?.response?.message === "ACCESS_TOKEN_EXPIRED"
    ) {
      console.warn("Refreshing token and trying again.");
      const refreshToken = localStorage.getItem("refreshToken");
      const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_REST_API_URL;
      axios
        .post(`${backendURL}/auth/refresh-token?refreshToken=${refreshToken}`)
        .then((response) => {
          const data = response?.data;
          const newAccessToken = data?.accessToken;

          if (newAccessToken) {
            localStorage.setItem("jwtToken", newAccessToken);
            window.location.reload();
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                Authorization: `Bearer ${newAccessToken}`
              }
            });

            // Retry the request with the new token
            return forward(operation);
          } else {
            console.error("Failed to get new access token");
          }
        })
        .catch((err) => {
          console.log("Refresh token error here", err);
        });
    }
  }
});

function App() {
  const client = new ApolloClient({
    link: from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache({ addTypename: false })
  });

  return (
    <ApolloProvider client={client}>
      <GlobalProvider>
        <BrowserRouter>
          <RoutesConfig />
        </BrowserRouter>
      </GlobalProvider>
    </ApolloProvider>
  );
}

export default App;
