import { gql } from "@apollo/client";
// LOGIN MUTATION
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

// REGISTER MUTATION
export const REGISTER_USER = gql`
  mutation register($firstname: String! $lastname: String! $email: String!, $password: String!) {
    register(firstname: $firstname lastname: $lastname email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!, $newPassword: String!) {
    resetPassword(email: $email, newPassword: $newPassword)
  }
`;
