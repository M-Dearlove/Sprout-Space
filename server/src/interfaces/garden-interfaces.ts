
// Plant Placement Input Interface for GraphQL arguments
export interface PlantPlacementInput {
  plantId: string;
  row: number;
  col: number;
  plantName?: string;
  color?: string;
  spacing?: number;
  plantsPerSquareFoot?: number;
  sunlight?: string;
  water?: string;
  image?: string;
}

// SaveGarden arguments interface for the resolver
export interface SaveGardenArgs {
  name: string;
  rows: number;
  cols: number;
  plants: PlantPlacementInput[];
}