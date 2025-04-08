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

//RESET PASSWORD MUTATION
export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!, $newPassword: String!) {
    resetPassword(email: $email, newPassword: $newPassword)
  }
`;

export const SET_USER_ROLE = gql`
  mutation SetUserRole($userId: ID!, $role: String!) {
    setUserRole(userId: $userId, role: $role) {
      _id
      firstname
      lastname
      email
      role
    }
  }
`;

//Garden Planner mutations
export const SAVE_GARDEN_MUTATION = gql`
  mutation SaveGarden($name: String!, $rows: Int!, $cols: Int!, $plants: [PlantInput!]!) {
    saveGarden(name: $name, rows: $rows, cols: $cols, plants: $plants) {
      id
      name
      rows
      cols
    }
  }
`;

export const DELETE_GARDEN_MUTATION = gql`
  mutation DeleteGarden($id: ID!) {
    deleteGarden(id: $id) {
      id
    }
  }
`;
