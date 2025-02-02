import express from 'express';
import FeedingLogsController from '../controllers/feedingLog.controller.js';
import authenticateToken from '../middlewares/middleware.authenticateToken.js';
import { verifyPermissions } from '../middlewares/middleware.verifyPermissions.js';


const feedingLogsController = new FeedingLogsController();


const router = express.Router();
router.use(express.json());

// FeedingLogs Routes
router.get('/feedingLogs/user/:id', authenticateToken, verifyPermissions, feedingLogsController.getFeedingLogsByUserId);
router.get('/feedingLogs/animal/:animalId', authenticateToken, feedingLogsController.getFeedingLogsByAnimalId);
router.post('/feedingLogs', feedingLogsController.createFeedingLog);

export default router;