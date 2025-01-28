import { Schema } from "mongoose";

const deviceShemaDefinition = new Schema({
    name: {
        type: String,
        required:true
    },
    mac_adress: {
        type: String,
        required:true
    }
})

export default deviceShemaDefinition;