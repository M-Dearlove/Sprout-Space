
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

  type PlantPlacement {
    plantId: ID!
    row: Int!
    col: Int!
  }

  input PlantPlacementInput {
    plantId: ID!
    row: Int!
    col: Int!
  }

  type Garden {
    id: ID!
    name: String!
    rows: Int!
    cols: Int!
    userId: ID!
    createdAt: String
    updatedAt: String
  }
  

  type Mutation {
    register(firstname: String!, lastname: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    resetPassword(email: String!, newPassword: String!): Boolean
    saveGarden(name: String!, rows: Int!, cols: Int! plants: [PlantPlacementInput!]): Garden
  }
`;

export default typeDefs;
