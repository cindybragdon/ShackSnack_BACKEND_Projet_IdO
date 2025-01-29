class SubdocumentService {
    constructor(model) {
        this.model = model;
    }
    
    // Find and return all subdocuments within a parent document
    async getAllSubdocuments(id, subdocumentName) {
        // Find the parent document by its ID
        const document = await this.model.findById(id);

        // Return null (Error 404) if the parent document is missing
        if (!document) {
            return null;
        }

        // Get the subdocuments by the provided name
        const subdocuments = document[subdocumentName];

        // Return null (Error 404) if the subdocuments array is missing
        if (!subdocuments) {
            return null;
        }

        return subdocuments;
    }

    // Find and return a specific subdocument by its ID
    async getSubdocumentById(id, subdocumentName, subdocId) {
        // Find the parent document by its ID
        const document = await this.model.findById(id);

        // Return null (Error 404) if the parent document is missing
        if (!document) {
            return null;
        }

        // Find the subdocument by its ID
        const subdocument = document[subdocumentName].id(subdocId);

        // Return null (Error 404) if the subdocument is missing
        if (!subdocument) {
            return null;
        }

        return subdocument;
    }

    // Create a new subdocument within a parent document
    async createSubdocument(id, subdocumentName, data) {
        try {
            // Find the parent document by its ID
            const document = await this.model.findById(id);

            // Return null (Error 404) if the parent document is missing
            if (!document) {
                return null;
            }

            // Add the new subdocument to the array
            document[subdocumentName].push(data);

            // Save the parent document to save the subdocument as well
            return await document.save();
        } catch (error) {
            // Handle validation errors and internal errors
            if (error.name === "ValidationError") {
                throw { status: 400, message: "Validation error", details: error.errors };
            }
            throw { status: 500, message: "Internal Server Error", details: error.message };
        }
    }

    // Update an existing subdocument within a parent document
    async updateSubdocument(id, subdocumentName, subdocId, data) {
        try {
            // Find the parent document by its ID
            const document = await this.model.findById(id);

            // Return null (Error 404) if the parent document is missing
            if (!document) {
                return null;
            }

            // Find the subdocument by its ID
            const subdocument = document[subdocumentName].id(subdocId);

            // Return null (Error 404) if the subdocument is missing
            if (!subdocument) {
                return null;
            }

            // Merge the new data into the subdocument
            Object.assign(subdocument, data);

            // Save the parent document to save the subdocument as well
            return await document.save();
        } catch (error) {
            // Handle validation errors and internal errors
            if (error.name === "ValidationError") {
                throw { status: 400, message: "Validation error", details: error.errors };
            }
            throw { status: 500, message: "Internal Server Error", details: error.message };
        }
    }

    // Delete a subdocument within a parent document
    async deleteSubdocument(id, subdocumentName, subdocId) {
        return this.model.findByIdAndUpdate(
            id,
            { $pull: { [subdocumentName]: { _id: subdocId } } }, // Use $pull to remove the subdocument by ID
            { new: true } // Return the updated document after deletion
        );
    }
}