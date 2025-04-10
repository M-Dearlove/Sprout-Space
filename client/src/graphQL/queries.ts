import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      _id
      firstname
      lastname
      email
      role
      createdAt
    }
  }
`;

// QUERY LOGGED-IN USER
export const QUERY_ME = gql`
  query me {
    me {
      _id
      firstname
      lastname
      email
      role
    }
  }
`;

// Garden Planner Queries
export const SEARCH_PLANTS_QUERY = gql`
  query SearchPlants($searchTerm: String!, $limit: Int) {
    searchPlants(searchTerm: $searchTerm, limit: $limit) {
      id
      commonName
      scientificName
      cycle
      watering
      sunlight
      defaultImage {
        thumbnail
      }
    }
  }
`;

export const GET_USER_GARDENS = gql`
  query GetUserGardens {
    userGardens {
      id
      name
      rows
      cols
      plants {
        row
        col
        plantId
        plantName
        color
        image
      }
    }
  }
`;

export const GET_GARDEN_BY_ID = gql`
  query GetGardenById($id: ID!) {
    garden(id: $id) {
      id
      name
      rows
      cols
      plants {
        id
        plantId
        row
        col
        plantName
        color
        spacing
        plantsPerSquareFoot
        sunlight
        water
        image
      }
    }
  }
`;
export const GET_ALL_PLANTS = gql`
  query GetAllPlants {
    plants {
      _id
      plantName
      plantType
      plantDescription
      plantImage
      plantWatering
      plantLight
      plantSoil
      plantFertilizer
      plantHumidity
      plantTemperature
      plantToxicity
      plantPests
      plantDiseases
      spacing
      plantsPerSquareFoot
      color
    }
  }
`;

export const GET_PLANT_BY_ID = gql`
  query GetPlantById($_id: ID!) {
    plant(_id: $_id) {
      _id
      plantName
      plantType
      plantDescription
      plantImage
      plantWatering
      plantLight
      plantSoil
      plantFertilizer
      plantHumidity
      plantTemperature
      plantToxicity
      plantPests
      plantDiseases
      spacing
      plantsPerSquareFoot
      color
    }
  }
`;

export const GET_PLANT_BY_NAME = gql`
  query GetPlantByName($plantName: String!) {
    plantByName(plantName: $plantName) {
      _id
      plantName
      plantType
      plantDescription
      plantImage
      plantWatering
      plantLight
      spacing
      plantsPerSquareFoot
      color
    }
  }
`;

export const SEARCH_PLANTS_BY_TYPE = gql`
  query SearchPlantsByType($plantType: String!) {
    searchPlantsByType(plantType: $plantType) {
      _id
      plantName
      plantType
      plantImage
      plantWatering
      plantLight
      spacing
      plantsPerSquareFoot
      color
    }
  }
`;
export const GET_PLANT_CARE_INFO = gql`
  query GetPlantCareInfo($plantName: String!) {
    getPlantCareInfo(plantName: $plantName)
  }
`;
