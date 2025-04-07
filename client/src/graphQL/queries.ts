import { gql } from "@apollo/client";


// QUERY LOGGED-IN USER
export const QUERY_ME = gql`
  query me {
    me {
      _id
      firstname
      lastname
      email
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
        id
        plantId
        row
        col
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
