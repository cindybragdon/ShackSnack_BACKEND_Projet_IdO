
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
    }

    // Update an existing subdocument within a parent document
    async updateSubdocument(id, subdocumentName, subdocId, data) {

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
    }

    // Delete a subdocument within a parent document
    async deleteSubdocument(id, subdocumentName, subdocId) {


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

                
        // Check if the subdocument with the given ID exists
        const subdocumentIndex = subdocuments.findIndex(subdoc => subdoc._id.toString() === subdocId);

        // Return null if the subdocument is not found
        if (subdocumentIndex === -1) {
            return null;
        }

        // Remove the subdocument from the array
        subdocuments.splice(subdocumentIndex, 1);

        // Save the parent document after deletion
        return await document.save();

    }
}

export default SubdocumentService;