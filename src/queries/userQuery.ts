import { gql } from "@apollo/client";

export const USER_SIGNIN = gql`
  mutation UserSignIn($userName: String!, $password: String!) {
    userSignIn(userName: $userName, password: $password) {
      accessToken
      refreshToken
      userDetails {
        id
        firstName
        lastName
        userName
      }
    }
  }
`;

export const ADD_ROLE_TO_USER = gql`
  mutation Mutation($userName: String!, $userRole: String!) {
    addRoleToUser(userName: $userName, userRole: $userRole) {
      userId
      userType
    }
  }
`;

export const GET_ALL_USERS = gql`
  query Query {
    getAllUsers {
      firstName
      lastName
      userName
      id
      userRoles {
        id
        userType
      }
    }
  }
`;

export const USER_SIGNUP = gql`
  mutation UserSignUp($createUserInput: createUserInput!) {
    userSignUp(createUserInput: $createUserInput) {
      accessToken
      refreshToken
      userDetails {
        id
        firstName
        lastName
        userName
      }
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      firstName
      id
      lastName
      userName
      userRoles {
        id
        userType
      }
    }
  }
`;

export const GET_ACCESS_TOKEN = gql`
  mutation Mutation($refreshToken: String!) {
    getNewAccessToken(refreshToken: $refreshToken) {
      accessToken
    }
  }
`;
