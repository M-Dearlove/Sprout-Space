import { Schema, model, Document } from 'mongoose';

// Define interface for Garden Plan document
export interface GardenPlanDocument extends Document {
  name: string;
  rows: number;
  cols: number;
  userId: string;
}

// Define the schema for the Garden Plan document
const gardenPlanSchema = new Schema<GardenPlanDocument>({
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

// Create and export the model
const GardenPlan = model<GardenPlanDocument>('GardenPlan', gardenPlanSchema);

export default GardenPlan;