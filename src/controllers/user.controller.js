import mongoose from "mongoose";
import userMongoModel from "../models/mongo.model.user";
import ServiceWithSubservices from "../services/mongo.serviceWithSubservices";
import { validateDocument } from "../models/manageModels";

const userService = new ServiceWithSubservices(userMongoModel);

class UserController {

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAll();
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found." });
      }
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  async getUserById(req, res) {
    try {
      const user = await userService.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  async createUser(req, res) {
    try {
      const newUser = await userService.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  async updateUser(req, res) {
    try {

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).send("ERROR WITH YOUR REQUEST ID");
        } 

        const userId = new mongoose.Types.ObjectId(req.params.id);

        if(!validateDocument(userMongoModel, req.body)){
            return res.status(400).send("ERROR WITH YOUR REQUEST");
        } 

        const updatedUser = await userService.update(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        
        res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  async deleteUser(req, res) {
    try {
      const deletedUser = await userService.delete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // ------- Subdocument Methods -------


  async getAllSubdocuments(req, res) {
    try {
      const subdocuments = await userService.getAllSubdocuments(req.params.id);
      if (!subdocuments) {
        return res.status(404).json({ message: "User or subdocuments not found." });
      }
      res.status(200).json(subdocuments);
    } catch (error) {
      console.error("Error fetching subdocuments:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  async getSubdocumentById(req, res) {
    try {
      const subdocument = await userService.getSubdocumentById(req.params.id, req.params.subdocId);
      if (!subdocument) {
        return res.status(404).json({ message: "Subdocument not found." });
      }
      res.status(200).json(subdocument);
    } catch (error) {
      console.error("Error fetching subdocument:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  async createSubdocument(req, res) {
    try {
      const updatedUser = await userService.createSubdocument(req.params.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error creating subdocument:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  async updateSubdocument(req, res) {
    try {
      const updatedUser = await userService.updateSubdocument(req.params.id, req.params.subdocId, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User or subdocument not found." });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating subdocument:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteSubdocument(req, res) {
    try {
      const updatedUser = await userService.deleteSubdocument(req.params.id, req.params.subdocId);
      if (!updatedUser) {
        return res.status(404).json({ message: "User or subdocument not found." });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error deleting subdocument:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new UserController();
