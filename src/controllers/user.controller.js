import { config } from "../config/config.js";
import userMongoModel from "../models/mongo.model.user.js";
import BaseService from "../services/mongo.baseService.js";
import SubdocumentService from "../services/mongo.SubdocumentService.js";
import { createError } from "../utils/error.createError.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const baseService = new BaseService(userMongoModel);
const subdocumentService = new SubdocumentService(userMongoModel);

class UserController {

    async getAllUsers(req, res, next) {
        try {
            const users = await baseService.getAll();
            if (!users || users.length === 0) {
                const error = createError("No users found.", 404);
                return next(error);
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
                const error = createError("User not found", 404);
                return next(error);
            }
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    async createUser(req, res, next) {
        try {

            const createUserData = req.body;

            if(!createUserData.password) {
                const error = createError("Password is required", 400);
                error.details = "Procured password is : " + req.body.password;
                next(error);
            }
            createUserData.password = await bcrypt.hash(req.body.password, 10);


            const newUser = await baseService.create(createUserData);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {

            const updateUserData = req.body;

            if(!updateUserData.password) {
                const error = createError("Password is required", 400);
                error.details = "Procured password is : " + req.body.password;
                next(error);
            }
            updateUserData.password = await bcrypt.hash(req.body.password, 10);

            const updatedUser = await baseService.update(req.params.id, updateUserData);
            if (!updatedUser) {
                const error = createError("User not found", 404);
                return next(error);
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
                const error = createError("User not found", 404);
                return next(error);
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
                const error = createError("No subdocument found.", 404);
                return next(error);
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
                const error = createError("Subdocument not found.", 404);
                return next(error);
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
                const error = createError("User not found", 404);
                return next(error);
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
                const error = createError("User or subdocument not found.", 404);
                return next(error);
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
                const error = createError("User or subdocument not found.", 404);
                return next(error);
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async createNewAccount(req, res, next) {
        try {
            const newUser = req.body;

            if(!newUser.password) {
                const error = createError("Password is required", 400);
                error.details = "Procured password is : " + newUser.password;
                next(error);
            }
            newUser.password = await bcrypt.hash(req.body.password, 10);

            const createdUser = await baseService.create(newUser);
            res.status(201).json(createdUser);
        } catch (error) {
            next(error);
        }
    }

    
    async loginAccount(req, res, next) {
        try {

            const email = req.body.email;
            const password = req.body.password;

            if(!email || !password) {
                const error = createError("The email and password are required", 400);
                next(error);
            }

            const user = await userMongoModel.findOne({ email:email });

            if (!user) {
                const error = createError("Invalid email or password", 401);
                next(error);

            }

            // 2. Compare the provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                const error = createError("Invalid email or password", 401);
                next(error);
            }

            // 3. Generate a JWT token (e.g., valid for 1 hour)
            const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
                expiresIn: '1h',
            });

            return res.status(200).json({ token, user: { id: user._id, email: user.email, role: user.role } });
        } catch (error) {
            next(error);
        }
    }

}

export default UserController;