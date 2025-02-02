import mongoose from "mongoose";

export const errorMiddleware = (error, req, res, next) => {



      // Handle known errors with specific status codes
    if (error.status === 401) {
        return res.status(401).json({ message: error.message || "Unauthorized" });
    }

    if (error.status === 403) {
        return res.status(403).json({ message: error.message || "Forbidden" });
    }

    if (error.status === 404) {
        return res.status(404).json({ message: error.message || "Ressource not found" });
    }
  
    // Handle Mongoose ObjectId errors
    if (error instanceof mongoose.Error.CastError && error.kind === 'ObjectId') {
        return res.status(400).json({
            error: "Invalid ObjectId",
            message: `The provided ID '${error.value}' for field '${error.path || '_id'}' is not a valid ObjectId.`,
            details: error.message
        });
    }


    // Handle Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            error: "Validation error",
            details: Object.entries(error.errors).map(([field, error]) => ({
                field,
                message: error.message,
            })),
        });

    }

    // Handle Mongoose type errors
    // Can occur when trying to create a subdocument but the name (like 'animals') in the
    // Path is not well written.
    if (error instanceof TypeError) {
        return res.status(400).json({
            error: "TypeError",
            message: error.message,
            details: "A property was accessed on an undefined or null value.",
        });
    }

    // Handle Mongoose 409 errors (unique value already taken)
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        return res.status(409).json({
            error: "Conflict",
            message: `The value '${value}' for '${field}' already exists.`,
            details: { field, value },
        });
    }



    // Handle other known errors with a status property
    if (error.status) {
        return res.status(error.status).json({
            error: error.message || "An error occurred",
            details: error.details || null,
        });
    }

    // Handle other unknown errors
    console.error("Unhandled error:", error);
    res.status(500).json({ error: "Internal Server Error" });
};