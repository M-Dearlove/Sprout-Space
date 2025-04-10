import { Schema, type Document } from 'mongoose';



export interface GardenDocument extends Document {
    gardenName: string;
    gardenType: string;
    gardenDescription: string;
    gardenImage: string;
    gardenWatering: string;
    gardenLight: string;
    gardenSoil: string;
    gardenFertilizer: string;
    gardenHumidity: string;
    gardenTemperature: string;
    gardenToxicity: string;
    gardenPests: string;
    gardenDiseases: string;
}

const gardenSchema = new Schema<GardenDocument>({
    gardenName: {
        type: String,
        required: true,
        trim: true,
    },
    gardenType: {
        type: String,           
        required: true,
        trim: true,
    },
    gardenDescription: {
        type: String,
        required: true,
        trim: true,
    },
    gardenImage: {
        type: String,
        required: true,
        trim: true,
    },
    gardenWatering: {
        type: String,
        required: true,
        trim: true,
    },
    gardenLight: {
        type: String,
        required: true,
        trim: true,
    },
    gardenSoil: {
        type: String,
        required: true,
        trim: true,
    },
    gardenFertilizer: {
        type: String,
        required: true,
        trim: true,
    },
    gardenHumidity: {
        type: String,
        required: true,
        trim: true,
    },
    gardenTemperature: {
        type: String,
        required: true,                 
        trim: true,
    },              
    gardenToxicity: {
        type: String,
        required: true,
        trim: true,
    },
    gardenPests: {   
        type: String,
        required: true,
        trim: true,
    },
    gardenDiseases: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    toObject: {
        virtuals: true,
        getters: true,
    },
    id: false,
});

// Create and export the Garden model
import mongoose from 'mongoose';

const Garden = mongoose.model<GardenDocument>('Garden', gardenSchema);
export default Garden;