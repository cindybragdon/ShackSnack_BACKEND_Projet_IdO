import { Schema } from "mongoose";
import createModel from "./manageModels";

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

const NotificationModel = createModel("Notification", notificationsShemaDefinition);

export default notificationsShemaDefinition;

export { NotificationModel };