import { Schema } from "mongoose";
import { regexPositiveInt, regexPositiveNumber } from "../utils/regex.js";
import createModel from "./manageModels.js";

const animalShemaDefinition = new Schema({
    name: {
        type: String,
        required: true
    },
    nickname: {
        type: String
    },
    type_animal: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        validate: {
            validator: (value) => regexPositiveNumber.test(value.toString()),
            message: 'The weight needs to be a positive int number.'
        }
    },
    birth_date: {
        type: Date
    },
    number_sec_treats: {
        type: Number,
        required: true,
        validate: {
            validator: (value) => regexPositiveInt.test(value.toString()),
            message: 'The number_sec_treat needs to be a positive int number.'
        }
    },
    number_sec_food: {
        type: Number,
        required: true,
        validate: {
            validator: (value) => regexPositiveInt.test(value.toString()),
            message: 'The number_sec_food needs to be a positive int number.'
        }
    }
}, { timestamps: true })

const AnimalModel = createModel("Animal", animalShemaDefinition);

export default animalShemaDefinition;

export { AnimalModel };


