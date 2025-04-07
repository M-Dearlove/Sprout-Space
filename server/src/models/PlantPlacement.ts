// server/models/PlantPlacement.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const plantPlacementSchema = new Schema({
  gardenId: {
    type: Schema.Types.ObjectId,
    ref: 'GardenPlan',
    required: true
  },
  plantId: {
    type: String,
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
    required: false
  },
  color: {
    type: String,
    required: false
  },
  spacing: {
    type: Number,
    required: false
  },
  plantsPerSquareFoot: {
    type: Number,
    required: false
  },
  sunlight: {
    type: String,
    required: false
  },
  water: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  }
});

const PlantPlacement = mongoose.model('PlantPlacement', plantPlacementSchema);
export default PlantPlacement;