import mongoose from "mongoose"



export const connectToMongoDatabase = async (database) => {
    try {
        await mongoose.connect(database);
        console.log(`Connected to Mongo Database!`);
        
    } catch(error) {
        console.error("Cannot connect to Mongo DB : ", error)
    }
    
}
