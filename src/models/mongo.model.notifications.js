import { Schema } from "mongoose";

//Shéma mongoose d'une notification
const notificationsShemaDefinition = new Schema({

    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required:true
    }
}, { timestamps: true })

export default notificationsShemaDefinition;
