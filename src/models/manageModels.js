import mongoose from "mongoose";


//PAs sur si utile
export default function createModel(name, schemaDefinition) {
    const schema = new mongoose.Schema(schemaDefinition);
    return mongoose.model(name, schema);
}

//Pas sur si utile
export function validateDocument(model, data) {
    const instance = new model(data);
    return !instance.validateSync();
}
  