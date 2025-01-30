
class BaseService {
    constructor(model) {
        this.model = model;
    }
  
    // Get all documents of the model
    async getAll() {
        return this.model.find();
    }
  
    // Find a parent document by its ID
    async getById(id) {
        return this.model.findById(id);
    }
  
    // Create a new document
    async create(data) {
        return new this.model(data).save();
    }
  
    // Update a document using save() to trigger schema validation
    async update(id, data) {

        // Find the document first
        const document = await this.model.findById(id);
        if (!document) return null; // Return null (Error 404) if not found

        // Merge new data into the existing document
        Object.assign(document, data);

        // Save and return the updated document
        return await document.save();
    }
  
    // Delete a parent document by its ID
    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}


export default BaseService;