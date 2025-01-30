import express from 'express';
import UserController from '../controllers/user.controller.js';


const userController = new UserController();

const router = express.Router();
router.use(express.json());

// User Routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// User Subdocuments Routes
router.get('/users/:id/:subdocument', userController.getAllSubdocuments);
router.get('/users/:id/:subdocument/:subdocId', userController.getSubdocumentById);
router.post('/users/:id/:subdocument', userController.createSubdocument);
router.put('/users/:id/:subdocument/:subdocId', userController.updateSubdocument);
router.delete('/users/:id/:subdocument/:subdocId', userController.deleteSubdocument);

export default router;