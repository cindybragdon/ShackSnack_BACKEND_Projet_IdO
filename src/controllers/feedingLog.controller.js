import feedingLogsModel from "../models/mongo.model.feedinglogs.js";
import BaseService from "../services/mongo.baseService.js";

class FeedingLogsController {
    constructor() {
        this.baseService = new BaseService(feedingLogsModel)
    }

    
    async getAllFeedingLogs(req, res) {
        try {
            const users = await this.baseService.getAll();
            if (!users || users.length === 0) {
                return res.status(404).json({ message: "No FeedingLog found." });
            }
            res.status(200).json(users);
        } catch (error) {
            this.handleError(res, error, "Error fetching FeedingLog");
        }
    }

    async getFeedingLogById(req, res) {
        try {
            const user = await this.baseService.getById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "FeedingLog not found." });
            }
            res.status(200).json(user);
        } catch (error) {
            this.handleError(res, error, "Error fetching FeedingLog");
        }
    }

    async createFeedingLog(req, res) {
        try {
            const newUser = await this.baseService.create(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            this.handleError(res, error, "Error creating FeedingLog");
        }
    }

    async updateFeedingLog(req, res) {
        try {
            const updatedUser = await this.baseService.update(req.params.id, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: "FeedingLog not found." });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            this.handleError(res, error, "Error updating FeedingLog");
        }
    }

    async deleteFeedingLog(req, res) {
        try {
            const deletedUser = await this.baseService.delete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ message: "FeedingLog not found." });
            }
            res.status(200).json({ message: "FeedingLog deleted successfully." });
        } catch (error) {
            this.handleError(res, error, "Error deleting user");
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

export default FeedingLogsController;