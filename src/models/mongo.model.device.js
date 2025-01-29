import { Schema } from "mongoose";
import createModel from "./manageModels";

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


const DeviceModel = createModel("Device", deviceShemaDefinition);



export default deviceShemaDefinition;

export { DeviceModel };