import { Schema, Document } from 'mongoose';

// Plant Placement Interface
interface PlantPlacementInput {
  plantId: string;
  row: number;
  col: number;
}

// Define an interface for the PlantPlacement document
export interface PlantPlacementDocument extends Document {
  plantId: string;
  gardenId: string;
  row: number;
  col: number;
}

// Define the schema for the PlantPlacement document
const plantPlacementSchema = new Schema<PlantPlacementDocument>({
  plantId: {
    type: String,
    ref: 'Plant',
    required: true
  },
  gardenId: {
    type: String,
    ref: 'Garden',
    required: true
  },
  row: {
    type: Number,
    required: true
  },
  col: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Define interface for Garden Planner specific fields
export interface GardenPlannerDocument extends Document {
  name: string;
  rows: number;
  cols: number;
  userId: string;
  plants?: PlantPlacementDocument[];
}

// Define the schema for the GardenPlanner document
const gardenPlannerSchema = new Schema<GardenPlannerDocument>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  rows: {
    type: Number,
    required: true,
    min: 1
  },
  cols: {
    type: Number,
    required: true,
    min: 1
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// SaveGarden arguments interface
interface SaveGardenArgs {
  name: string;
  rows: number;
  cols: number;
  plants: PlantPlacementInput[];
}

export { 
  PlantPlacementInput,
  SaveGardenArgs,
  plantPlacementSchema,
  gardenPlannerSchema
};