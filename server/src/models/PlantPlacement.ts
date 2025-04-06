import { Schema, model, Document } from 'mongoose';

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
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Create and export the model
const PlantPlacement = model<PlantPlacementDocument>('PlantPlacement', plantPlacementSchema);

export default PlantPlacement;