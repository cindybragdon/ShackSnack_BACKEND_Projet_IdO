class ServiceWithSubservices {
    constructor(model, subdocument) {
      this.model = model;
      this.subdocument = subdocument
    }
  
    async getAll() {
      return this.model.find();
    }
  
    async getById(id) {
      return this.model.findById(id);
    }
  
    async create(data) {
      return new this.model(data).save();
    }
  
    async update(id, data) {
      return this.model.findByIdAndUpdate(id, data, { new: true });
    }
  
    async delete(id) {
      return this.model.findByIdAndDelete(id);
    }

    async getAllSubdocuments(id) {
      const data = await this.model.findById(id);
      return data ? data[this.subdocument] : null;
    }

    async getSubdocumentById(id, subdocumentId) {

      //{ _id: id, [`${this.subdocument}._id`]: subdocumentId },
      //_id: id, : _id need to be the same as id
      //[`${this.subdocument}._id`]: subdocumentId } : this.subdocument._id needs to be the same that subdocumentId
      const data = await this.model.findOne(
        { _id: id, [`${this.subdocument}._id`]: subdocumentId },
        { [`${this.subdocument}.$`]: 1 } //Make the result only be 1 object long
      );
      return data ? data[this.subdocument][0] : null;
    }
    
    async createSubdocument(id, data) {
      return this.model.findByIdAndUpdate(
        id,
          { $push: { [this.subdocument]: data } }, //We need to use $push to add a subdocument to a document
          { new: true } //Return the updated model after adding a subdocument
      );
    }
    
    async updateSubdocument(id, subdocId, data) {
      return this.model.findOneAndUpdate(
          { _id: id, [`${this.subdocument}._id`]: subdocId }, //find a document with valid id and subdocument id
          { $set: { [`${this.subdocument}.$`]: data } }, //We need to use $set to update a subdocument of a document
          { new: true } //Return the updated model after updating a subdocument
      );
    }
    
    async deleteSubdocument(id, subdocId) {
      return this.model.findByIdAndUpdate(
        id,
          { $pull: { [this.subdocument]: { _id: subdocId } } }, //We need to use $pull to delete a subdocument of a document and it needs an id of the subdocument
          { new: true } //Return the updated model after deleting a subdocument
      );
    }
}
  

export default ServiceWithSubservices;