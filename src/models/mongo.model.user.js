import mongoose, { Schema } from "mongoose";
import { regexEmail } from "../utils/regex.js";
import animalShemaDefinition from "./mongo.model.animal.js";
import deviceShemaDefinition from "./mongo.model.device.js";
import notificationsShemaDefinition from "./mongo.model.notifications.js";

const userSchemaDefinition = new Schema({

    firstname: { 
        type: String,
        required: true
    },
    lastname: { 
        type: String,
        required: true
    },
    username: { 
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true 
    },
    role: { 
        type: String,
        required:true,
        enum: ["Admin", "User"]
    },
    description: { 
        type: String
    },
    email: { 
        type: String,
        required:true,
        unique:true,
        validate: {
            validator: (value) => regexEmail.test(value.toString()),
            message: 'The email needs to be an email.'
        }
    },

    animals: [animalShemaDefinition],
    devices: [deviceShemaDefinition],
    notifications: [notificationsShemaDefinition]

}, { timestamps: true });

const userMongoModel = mongoose.model('User', userSchemaDefinition);

export default userMongoModel;
