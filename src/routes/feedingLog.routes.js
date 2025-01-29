import express from 'express';
import FeedingLogsController from '../controllers/feedingLog.controller.js';
import { validateFormatMiddleware } from '../middlewares/invalidationsMiddleware.js';


const feedingLogsController = new FeedingLogsController();


const router = express.Router();
router.use(express.json());

// FeedingLogs Routes
router.get('/users', feedingLogsController.getAllFeedingLogs);
router.get('/users/:id', feedingLogsController.getFeedingLogById, validateFormatMiddleware);
router.post('/users', feedingLogsController.createFeedingLog, validateFormatMiddleware);
router.put('/users/:id', feedingLogsController.updateFeedingLog, validateFormatMiddleware);
router.delete('/users/:id', feedingLogsController.deleteFeedingLog, validateFormatMiddleware);

export default router;