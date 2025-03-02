import mongoose, { Schema } from "mongoose";

//Shéma mongoose d'un feeding log.
//Un feeding log est un log d'une fois ou un certain animal a mangé.
const feedingLogs = Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    animalId: { 
        type: Schema.Types.ObjectId, 
        required: true 
    },
    deviceId: { 
        type: Schema.Types.ObjectId, 
        required: true 
    },
    feeding_date: {
        type: Date,
        required: true
    },
    feeding_food_type: {
        type: String,
        required: true,
        enum: ["Dry Food", "Treats"]
    },
    feeding_quantity: {
        type: Number,
        required: true,
        validate: {
            validator: (value) => value > 0,
            message: 'Feeding quantity must be a positive number.'
        }
    }
}, { timestamps: true });


const feedingLogsModel = mongoose.model('FeedingLogs', feedingLogs);

export default feedingLogsModel;