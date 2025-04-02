import { gql } from "@apollo/client";


// QUERY LOGGED-IN USER
export const QUERY_ME = gql`
  query me {
    me {
      _id
      email
    }
  }
`;

