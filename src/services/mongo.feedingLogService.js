import userMongoModel from "../models/mongo.model.user.js";

class FeedingLogService {
    constructor(model) {
        this.model = model;
    }
  
    // Get all documents of the model
    async getFeedingLogsByAttribute(attributeName, value) {
        const query = {};
        query[attributeName] = value;  // Dynamically set the key and value
        return this.model.find(query);
    }
  
    // Create a new document
    async create(data) {

        const user = userMongoModel.findById(data.userId);
        if (!user) {
            return null;
        }

        // Check if the animalId exists in the user's animals array
        const animalExists = user.animals.some(animal => animal._id.toString() === data.animalId.toString());
        if (!animalExists) {
            return null;
        }

        // Check if the deviceId exists in the user's devices array
        const deviceExists = user.devices.some(device => device._id.toString() === data.deviceId.toString());
        if (!deviceExists) {
            return null;
        }

        return new this.model(data).save();
    }
  
}

export default FeedingLogService;