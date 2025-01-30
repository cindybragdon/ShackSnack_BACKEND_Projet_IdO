import userMongoModel from "../models/mongo.model.user.js";
import BaseService from "../services/mongo.baseService.js";
import SubdocumentService from "../services/mongo.SubdocumentService.js";



const baseService = new BaseService(userMongoModel);
const subdocumentService = new SubdocumentService(userMongoModel);

class UserController {


    async getAllUsers(req, res, next) {
        try {
            const users = await baseService.getAll();
            if (!users || users.length === 0) {
                return res.status(404).json({ message: "No users found." });
            }
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await baseService.getById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    async createUser(req, res, next) {
        try {
            const newUser = await baseService.create(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const updatedUser = await baseService.update(req.params.id, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const deletedUser = await baseService.delete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json({ message: "User deleted successfully." });
        } catch (error) {
            next(error);
        }
    }


    async getAllSubdocuments(req, res, next) {
        try {
            const subdocuments = await subdocumentService.getAllSubdocuments(req.params.id, req.params.subdocument,);
            if (!subdocuments || subdocuments.length === 0) {
                return res.status(404).json({ message: "No subdocument found." });
            }
            res.status(200).json(subdocuments);
        } catch (error) {
            next(error);
        }
    }


    
    async getSubdocumentById(req, res, next) {
        try {
            const subdocuments = await subdocumentService.getSubdocumentById(req.params.id, req.params.subdocument, req.params.subdocId);
            if (!subdocuments) {
                return res.status(404).json({ message: "Subdocument not found." });
            }
            res.status(200).json(subdocuments);
        } catch (error) {
            next(error);
        }
    }

    async createSubdocument(req, res, next) {
        try {
            const updatedUser = await subdocumentService.createSubdocument(req.params.id, req.params.subdocument, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async updateSubdocument(req, res, next) {
        try {
            const updatedUser = await subdocumentService.updateSubdocument(req.params.id, req.params.subdocument, req.params.subdocId, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: "User or subdocument not found." });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async deleteSubdocument(req, res, next) {
        try {
            const updatedUser = await subdocumentService.deleteSubdocument(req.params.id, req.params.subdocument, req.params.subdocId);
            if (!updatedUser) {
                return res.status(404).json({ message: "User or subdocument not found." });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }


}

export default UserController;