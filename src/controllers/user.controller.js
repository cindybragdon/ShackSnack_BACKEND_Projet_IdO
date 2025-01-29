import userMongoModel from "../models/mongo.model.user";

class UserController {
    constructor() {
        this.baseService = BaseService(userMongoModel);
        this.subdocumentService = SubdocumentService(userMongoModel);
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.baseService.getAll();
            if (!users || users.length === 0) {
                return res.status(404).json({ message: "No users found." });
            }
            res.status(200).json(users);
        } catch (error) {
            this.handleError(res, error, "Error fetching users");
        }
    }

    async getUserById(req, res) {
        try {
            const user = await this.baseService.getById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json(user);
        } catch (error) {
            this.handleError(res, error, "Error fetching user");
        }
    }

    async createUser(req, res) {
        try {
            const newUser = await this.baseService.create(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            this.handleError(res, error, "Error creating user");
        }
    }

    async updateUser(req, res) {
        try {
            const updatedUser = await this.baseService.update(req.params.id, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            this.handleError(res, error, "Error updating user");
        }
    }

    async deleteUser(req, res) {
        try {
            const deletedUser = await this.baseService.delete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json({ message: "User deleted successfully." });
        } catch (error) {
            this.handleError(res, error, "Error deleting user");
        }
    }


    async getAllSubdocuments(req, res) {
        try {
            const subdocuments = await this.subdocumentService.getAllSubdocuments(req.params.id, req.params.subdocument,);
            if (!subdocuments || subdocuments.length === 0) {
                return res.status(404).json({ message: "No subdocument found." });
            }
            res.status(200).json(subdocuments);
        } catch (error) {
            this.handleError(res, error, "Error fetching users");
        }
    }


    
    async getSubdocumentById(req, res) {
        try {
            const subdocuments = await this.subdocumentService.getById(req.params.id, req.params.subdocument, req.params.subdocId);
            if (!subdocuments) {
                return res.status(404).json({ message: "Subdocument not found." });
            }
            res.status(200).json(user);
        } catch (error) {
            this.handleError(res, error, "Error fetching user");
        }
    }

    async createSubdocument(req, res) {
        try {
            const updatedUser = await this.subdocumentService.createSubdocument(req.params.id, req.params.subdocument, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            this.handleError(res, error, "Error creating subdocument");
        }
    }

    async updateSubdocument(req, res) {
        try {
            const updatedUser = await this.subdocumentService.updateSubdocument(req.params.id, req.params.subdocument, req.params.subdocId, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: "User or subdocument not found." });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            this.handleError(res, error, "Error updating subdocument");
        }
    }

    async deleteSubdocument(req, res) {
        try {
            const updatedUser = await this.subdocumentService.deleteSubdocument(req.params.id, req.params.subdocument, req.params.subdocId);
            if (!updatedUser) {
                return res.status(404).json({ message: "User or subdocument not found." });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            this.handleError(res, error, "Error deleting subdocument");
        }
    }

    // Handle errors thrown by the service
    handleError(res, error, defaultMessage) {
        if (error.status === 400) {
            // Handle 400 validation errors
            return res.status(400).json({
                error: error.message || "Bad Request",
                details: error.details || null
            });
        }

        // Log internal errors for debugging
        console.error(defaultMessage, error);

        // Return 500 Internal Server Error if it's not a validation error
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default UserController;