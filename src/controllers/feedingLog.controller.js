import feedingLogsModel from "../models/mongo.model.feedinglogs.js";
import BaseService from "../services/mongo.baseService.js";
import FeedingLogService from "../services/mongo.feedingLogService.js";
import { createError } from "../utils/error.createError.js";


const baseService = new BaseService(feedingLogsModel)
const feedingLogService = new FeedingLogService(feedingLogsModel);

class FeedingLogsController {
    
    async getFeedingLogsByUserId(req, res, next) {
        try {
            const feedingLogs = await feedingLogService.getFeedingLogsByAttribute('userId', req.params.userId);
            if (!feedingLogs || feedingLogs.length === 0) {
                const error = createError("No FeedingLog found.", 404);
                return next(error);
            }
            res.status(200).json(feedingLogs);
        } catch (error) {
            next(error);
        }
    }

    async getFeedingLogsByAnimalId(req, res, next) {
        try {
            const feedingLogs = await feedingLogService.getFeedingLogsByAttribute('animalId', req.params.animalId);
            if (!feedingLogs || feedingLogs.length === 0) {
                const error = createError("No FeedingLog found.", 404);
                return next(error);
            }
            res.status(200).json(feedingLogs);
        } catch (error) {
            next(error);
        }
    }

    async createFeedingLog(req, res, next) {
        try {
            const newFeedingLog = await baseService.create(req.body);
            res.status(201).json(newFeedingLog);
        } catch (error) {
            next(error);
        }
    }

}

export default FeedingLogsController;