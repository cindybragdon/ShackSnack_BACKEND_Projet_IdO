import mongoose, { Schema } from "mongoose";
import { regexEmail } from "../utils/regex.js";
import animalShemaDefinition from "./mongo.model.animal.js";
import deviceShemaDefinition from "./mongo.model.device.js";
import notificationsShemaDefinition from "./mongo.model.notifications.js";
import bcrypt from 'bcrypt';
import { createError } from "../utils/error.createError.js";

//Shéma mongoose d'un user
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
    expoPushToken: {
        type: String,
    },
    expoCreatedAt: {
        type: Date
    },

    animals: { type: [animalShemaDefinition], default: [] },
    devices: { 
        type: [deviceShemaDefinition], 
        default: [], 
        validate: {
            validator: function (devices) {
                return devices.length <= 1;
            },
            message: "A user can only have one device."
        }
    },
    notifications: { type: [notificationsShemaDefinition], default: [] }

}, { timestamps: true });


// Run this function (mongo hook) when the .save() mongo function is called.
// This function is called when the service functions create() and update() are called
// It makes all the passwords hashed.
userSchemaDefinition.pre("save", async function(next) {

    if (this.isNew || this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();

    if (this.devices.length > 1) {
        return next(createError(400, "A user can only have one device."));
    }
    next();
});



const userMongoModel = mongoose.model('User', userSchemaDefinition);

export default userMongoModel;
