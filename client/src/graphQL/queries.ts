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

