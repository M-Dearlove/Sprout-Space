// Plant interface definition
export interface Plant {
    id: string;
    name: string;
    color: string;
    width: number;
    height: number;
    spacing: number;
    sunlight: string;
    water: string;
  }
  
  // Garden cell type
  export type GardenCell = Plant | null;
  
  // Garden grid type
  export type GardenGrid = GardenCell[][];
  
  // API response types
  export interface PlantApiResponse {
    data: PlantApiData[];
    total: number;
    to: number;
    per_page: number;
    current_page: number;
    last_page: number;
  }
  
  export interface PlantApiData {
    id: number;
    common_name: string;
    scientific_name: string;
    cycle: string;
    watering: string;
    sunlight: string[];
    default_image?: {
      thumbnail: string;
    };
  }