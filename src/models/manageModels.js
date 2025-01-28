

export default function createModel(name, schemaDefinition) {
    const schema = new mongoose.Schema(schemaDefinition);
    return mongoose.model(name, schema);
}

export function validateDocument(model, data) {
    const instance = new model(data);
    return !instance.validateSync();
}
  