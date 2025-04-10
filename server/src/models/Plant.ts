// server/models/Plant.js
import { Schema, model, Document } from 'mongoose';


interface IPlant extends Document {
    plantName: string;
    plantType: string;
    plantDescription: string;
    plantImage: string;
    plantWatering: string;
    plantLight: string;
    plantSoil: string;
    plantFertilizer: string;
    plantHumidity: string;
    plantTemperature: string;
    plantToxicity: string;
    plantPests: string;
    plantDiseases: string;
    spacing: number;
    plantsPerSquareFoot: number;
    color: string;
}

const plantSchema = new Schema<IPlant>(
{
    plantName: {
        type: String,
        required: true,
        trim: true,
    },
    plantType: {
        type: String,           
        required: true,
        trim: true,
    },
    plantDescription: {
        type: String,
        required: true,
        trim: true,
    },
    plantImage: {
        type: String,
        required: true,
        trim: true,
    },
    plantWatering: {
        type: String,
        required: true,
        trim: true,
    },
    plantLight: {
        type: String,
        required: true,
        trim: true,
    },
    plantSoil: {
        type: String,
        required: true,
        trim: true,
    },
    plantFertilizer: {
        type: String,
        required: true,
        trim: true,
    },
    plantHumidity: {
        type: String,
        required: true,
        trim: true,
    },
    plantTemperature: {
        type: String,
        required: true,                 
        trim: true,
    },              
    plantToxicity: {
        type: String,
        required: true,
        trim: true,
    },
    plantPests: {   
        type: String,
        required: true,
        trim: true,
    },
    plantDiseases: {
        type: String,
        required: true,
        trim: true,
    },
    // Additional fields for garden planner
    spacing: {
        type: Number,
        required: true,
        default: 12
    },
    plantsPerSquareFoot: {
        type: Number,
        required: true,
        default: 1
    },
    color: {
        type: String,
        required: true,
        default: '#4CAF50'
    }
});

const Plant = model<IPlant>('Plant', plantSchema);
export default Plant;