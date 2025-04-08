
const typeDefs = `
  type User {
    _id: ID!
    firstname: String!
    lastname: String!
    email: String!
    token: String
    createdAt: String
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
    plants: [Plant]
    plant(_id: ID!): Plant
    plantByName(plantName: String!): Plant
    searchPlantsByType(plantType: String!): [Plant]
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
  

  type Plant {
    _id: ID!
    plantName: String!
    plantType: String!
    plantDescription: String!
    plantImage: String!
    plantWatering: String!
    plantLight: String!
    plantSoil: String!
    plantFertilizer: String!
    plantHumidity: String!
    plantTemperature: String!
    plantToxicity: String!
    plantPests: String!
    plantDiseases: String!
    spacing: Int!
    plantsPerSquareFoot: Float!
    color: String!
  }
    
  input PlantInput {
    plantId: String!
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

  type Mutation {
    register(firstname: String!, lastname: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    resetPassword(email: String!, newPassword: String!): Boolean
    saveGarden(name: String!, rows: Int!, cols: Int!, plants: [PlantInput!]): Garden
  }
`;


export default typeDefs;
