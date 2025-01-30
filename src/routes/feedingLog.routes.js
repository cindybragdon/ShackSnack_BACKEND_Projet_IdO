import express from 'express';
import FeedingLogsController from '../controllers/feedingLog.controller.js';


const feedingLogsController = new FeedingLogsController();


const router = express.Router();
router.use(express.json());

// FeedingLogs Routes
router.get('/feedingLogs/user/:userId', feedingLogsController.getFeedingLogsByUserId);
router.get('/feedingLogs/animal/:animalId', feedingLogsController.getFeedingLogsByAnimalId);
router.post('/feedingLogs', feedingLogsController.createFeedingLog);

export default router;