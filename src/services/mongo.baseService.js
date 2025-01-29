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
        try {
            return new this.model(data).save();
        } catch (error) {
            // Handle validation errors and internal errors
            if (error.name === "ValidationError") {
                throw { status: 400, message: "Validation error", details: error.errors };
            }
            throw { status: 500, message: "Internal Server Error", details: error.message };
        }
    }
  
    // Update a document using save() to trigger schema validation
    async update(id, data) {
        try {
            // Find the document first
            const document = await this.model.findById(id);
            if (!document) return null; // Return null (Error 404) if not found
  
            // Merge new data into the existing document
            Object.assign(document, data);
  
            // Save and return the updated document
            return await document.save();
        } catch (error) {
            // Handle validation errors and internal errors
            if (error.name === "ValidationError") {
                throw { status: 400, message: "Validation error", details: error.errors };
            }
            throw { status: 500, message: "Internal Server Error", details: error.message };
        }
    }
  
    // Delete a parent document by its ID
    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}

export default BaseService;