
const typeDefs = `
  type User {
    _id: ID!
    email: String!
    token: String
  }

  type AuthPayload {
    user: User
    token: String
  }

  type Query {
    me: User
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    resetPassword(email: String!, newPassword: String!): Boolean
  }
`;

export default typeDefs;
