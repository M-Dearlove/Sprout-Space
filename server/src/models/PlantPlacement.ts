import { Schema, model, Document } from 'mongoose';

// Define an interface for the PlantPlacement document
export interface PlantPlacementDocument extends Document {
  plantId: string;
  gardenId: string;
  row: number;
  col: number;
  plantName: string;
  color: string;
  spacing: number;
  plantsPerSquareFoot: number;
  sunlight: string;
  water: string;
  image: string;
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
    ref: 'GardenPlan',
    required: true
  },
  row: {
    type: Number,
    required: true
  },
  col: {
    type: Number,
    required: true
  },
  plantName: {
    type: String,
    default: "Plant",
  },
  color: {
    type: String,
    default: "#4CAF50"
  },
  spacing: {
    type: Number,
    default: 12
  },
  plantsPerSquareFoot: {
    type: Number,
    default: 1
  },
  sunlight: {
    type: String,
    default: "Full Sun"
  },
  water: {
    type: String,
    default: "Regular"
  },
  image: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/128/628/628324.png'
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Create and export the model
const PlantPlacement = model<PlantPlacementDocument>('PlantPlacement', plantPlacementSchema);

export default PlantPlacement;