import { config } from "../config/config.js";
import userMongoModel from "../models/mongo.model.user.js";
import BaseService from "../services/mongo.baseService.js";
import SubdocumentService from "../services/mongo.SubdocumentService.js";
import { createError } from "../utils/error.createError.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//Controller de User


//Services du user
const baseService = new BaseService(userMongoModel);
const subdocumentService = new SubdocumentService(userMongoModel);

class UserController {

    //Avoir la liste de tout les users (admin)
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

    //Avoir un user par son ID(admin)
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

    //Créer un nouveau user (admin)
    async createUser(req, res, next) {
        try {
            const newUser = await baseService.create(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    //Update un user par son ID
    async updateUser(req, res, next) {
        try {

            const updatedUser = await baseService.update(req.params.id, req.body);

            if (!updatedUser) {
                const error = createError("User not found", 404);
                return next(error);
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    //Delete in user par son ID
    async deleteUser(req, res, next) {
        try {
            const deletedUser = await baseService.delete(req.params.id);
            if (!deletedUser) {
                const error = createError("User not found", 404);
                return next(error);
            }
            res.status(204).json({ message: "User deleted successfully." });
        } catch (error) {
            next(error);
        }
    }


    //Avoir tout les sous document d'un certain type d'un user
    async getAllSubdocuments(req, res, next) {
        try {
            const subdocuments = await subdocumentService.getAllSubdocuments(req.params.id, req.params.subdocument);
            if (!subdocuments || subdocuments.length === 0) {
                const error = createError("No subdocument found.", 404);
                return next(error);
            }
            res.status(200).json(subdocuments);
        } catch (error) {
            next(error);
        }
    }


    //Avoir un sous document par son ID en spécifiant de quel type de sous document il s'agit
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

    //Créer un sous document
    async createSubdocument(req, res, next) {
        try {
            const updatedUser = await subdocumentService.createSubdocument(req.params.id, req.params.subdocument, req.body);
            if (!updatedUser) {
                const error = createError("User not found", 404);
                return next(error);
            }
            res.status(201).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    //Updater un sous document
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

    //Effacer un sous document
    async deleteSubdocument(req, res, next) {
        try {
            const deletedUser = await subdocumentService.deleteSubdocument(req.params.id, req.params.subdocument, req.params.subdocId);
            if (!deletedUser) {
                const error = createError("User or subdocument not found.", 404);
                return next(error);
            }
            res.status(204).json(deletedUser);
        } catch (error) {
            next(error);
        }
    }

    //Créer un nouveau compte
    async createNewAccount(req, res, next) {
        try {
            
            const createdUser = await baseService.create(req.body);
            const token = jwt.sign({ id: createdUser._id, role: createdUser.role }, config.jwtSecret, {
                expiresIn: '1h',
            });

            res.status(201).json({ token, user: { 
                id: createdUser._id, 
                username: createdUser.username,
                firstname: createdUser.firstname, 
                lastname: createdUser.lastname,
                description: createdUser.description,
                email: createdUser.email, 
                role: createdUser.role,
                expoPushToken: createdUser.expoPushToken
            },
                animals:createdUser.animals,
                devices:createdUser.devices
                
            });
        } catch (error) {
            next(error);
        }
    }

    //Logger dans son compte
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
            console.log(user);
            const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
                expiresIn: '5h',
            });

            return res.status(200).json({ token, user: { 
                id: user._id, 
                username: user.username,
                firstname: user.firstname, 
                lastname: user.lastname,
                description: user.description,
                email: user.email, 
                role: user.role,
                expoPushToken: user.expoPushToken
            },
                animals:user.animals,
                devices:user.devices
                
            });
        } catch (error) {
            next(error);
        }
    }

}

export default UserController;