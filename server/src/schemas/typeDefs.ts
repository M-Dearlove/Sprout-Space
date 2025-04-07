
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
    userGardens: [Garden]
    garden(id: ID!): Garden
    getPlantCareInfo(plantName: String!): String
  }

  type PlantPlacement {
    id: ID!
    plantId: ID!
    row: Int!
    col: Int!
    plantName: String
    color: String
    spacing: Int
    plantsPerSquareFoot: Float
    sunlight: String
    water: String
    image: String
  }

  input PlantPlacementInput {
    plantId: ID!
    row: Int!
    col: Int!
    plantName: String
    color: String
    spacing: Int
    plantsPerSquareFoot: Float
    sunlight: String
    water: String
    image: String
  }

  type Garden {
    id: ID!
    name: String!
    rows: Int!
    cols: Int!
    userId: ID!
    plants: [PlantPlacement]
    createdAt: String
    updatedAt: String
  }
  

  type Mutation {
    register(firstname: String!, lastname: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    resetPassword(email: String!, newPassword: String!): Boolean
    saveGarden(name: String!, rows: Int!, cols: Int!, plants: [PlantPlacementInput!]): Garden
  }
`;

export default typeDefs;
