import express from 'express';
import UserController from '../controllers/user.controller.js';
import authenticateToken from '../middlewares/middleware.authenticateToken.js';
import { denyCreateAccountAdmin, verifyAdmin, verifyPermissions } from '../middlewares/middleware.verifyPermissions.js';


const userController = new UserController();

const router = express.Router();
router.use(express.json());

// User Routes
router.get('/users', authenticateToken, verifyAdmin, userController.getAllUsers);
router.get('/users/:id', authenticateToken, verifyPermissions, userController.getUserById);
router.post('/users', authenticateToken, verifyAdmin, verifyPermissions, userController.createUser);
router.put('/users/:id', authenticateToken, verifyPermissions, userController.updateUser);
router.delete('/users/:id', authenticateToken, verifyPermissions, userController.deleteUser);

// User authentification routes
router.post('/users/login', userController.loginAccount);
router.post('/users/createAccount', denyCreateAccountAdmin, userController.createNewAccount);
// User Subdocuments Routes
router.get('/users/:id/:subdocument', authenticateToken, verifyPermissions, userController.getAllSubdocuments);
router.get('/users/:id/:subdocument/:subdocId', authenticateToken, verifyPermissions, userController.getSubdocumentById);
router.post('/users/:id/:subdocument', authenticateToken, verifyPermissions, userController.createSubdocument);
router.put('/users/:id/:subdocument/:subdocId', authenticateToken, verifyPermissions, userController.updateSubdocument);
router.delete('/users/:id/:subdocument/:subdocId', authenticateToken, verifyPermissions, userController.deleteSubdocument);

export default router;