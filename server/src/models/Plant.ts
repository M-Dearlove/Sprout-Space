import { Schema, type Document } from 'mongoose';

export interface PlantDocument extends Document {
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
}

const plantSchema = new Schema<PlantDocument>({
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
// Create and export the Plant model
import mongoose from 'mongoose';

const Plant = mongoose.model<PlantDocument>('Plant', plantSchema);
export default Plant;
