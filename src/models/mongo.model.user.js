import mongoose, { Schema } from "mongoose";
import { regexEmail } from "../utils/regex.js";
import animalShemaDefinition from "./mongo.model.animal.js";
import deviceShemaDefinition from "./mongo.model.device.js";
import notificationsShemaDefinition from "./mongo.model.notifications.js";
import bcrypt from 'bcrypt';
import { createError } from "../utils/error.createError.js";


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
    devices: { type: [deviceShemaDefinition], default: [] },
    notifications: { type: [notificationsShemaDefinition], default: [] }

}, { timestamps: true });


// Run this function (mongo hook) when the .save() mongo function is called.
// This function is called when the service functions create() and update() are called
// It makes all the passwords hashed.
userSchemaDefinition.pre("save", async function(next) {


    /*
    // Verify that a new user cannot have animals, devices or notifications at the creation.
    if (this.isNew) {
        // Ensure these fields are empty when creating a new user
        if (this.animals.length > 0 || this.devices.length > 0 || this.notifications.length > 0) {
            const error = new createError('Could not save the user', 400);
            error.details = 'Cannot create a user with animals, devices, or notifications.'
            return next(error);
        }
    }
    */

    // Verify that a device, an animal and a notification cannot be modified, created or deleted 
    // From the user route.
    /*
    if(this.isUsingBaseRoute) {
        if (this.isModified('devices') || this.isModified('animals') || this.isModified('notifications')) {
            const error = new createError('Could not save the user', 400);
            error.details = 'Modifications of devices, animals, or notifications are not allowed in this route'
            next(error);
        }
    }
        */


    if(!this.password) {
        const error = createError("Password is required", 400);
        error.details = "Procured password is : " + this.password;
        next(error);
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});



const userMongoModel = mongoose.model('User', userSchemaDefinition);

export default userMongoModel;
