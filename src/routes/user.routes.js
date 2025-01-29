import express from 'express';
import UserController from '../controllers/user.controller.js';
import { validateFormatMiddleware } from '../middlewares/invalidationsMiddleware.js';


const userController = new UserController();


const router = express.Router();
router.use(express.json());

// User Routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById, validateFormatMiddleware);
router.post('/users', userController.createUser, validateFormatMiddleware);
router.put('/users/:id', userController.updateUser, validateFormatMiddleware);
router.delete('/users/:id', userController.deleteUser, validateFormatMiddleware);

// User Subdocuments Routes
router.get('/users/:id/:subdocument', userController.getAllSubdocuments, validateFormatMiddleware);
router.get('/users/:id/:subdocument/:subdocId', userController.getSubdocumentById, validateFormatMiddleware);
router.post('/users/:id/:subdocument', userController.createSubdocument, validateFormatMiddleware);
router.put('/users/:id/:subdocument/:subdocId', userController.updateSubdocument, validateFormatMiddleware);
router.delete('/users/:id/:subdocument/:subdocId', userController.deleteSubdocument, validateFormatMiddleware);

export default router;