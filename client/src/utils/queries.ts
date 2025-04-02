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
  mutation register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

// QUERY LOGGED-IN USER
export const QUERY_ME = gql`
  query me {
    me {
      _id
      email
    }
  }
`;

