
const typeDefs = `
  type User {
    _id: ID!
    firstname: String!
    lastname: String!
    email: String!
    token: String
  }

  type AuthPayload {
    user: User
    token: String
  }

  type Query {
    me: User
    getPlantCareInfo(plantName: String!): String
  }

  type Mutation {
    register(firstname:  String! lastname: String! email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    resetPassword(email: String!, newPassword: String!): Boolean
  }
`;

export default typeDefs;
