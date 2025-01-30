import mongoose from "mongoose";

export const errorMiddleware = (err, req, res, next) => {


    // Handle Mongoose ObjectId errors
    if (err instanceof mongoose.Error.CastError && err.kind === 'ObjectId') {
        return res.status(400).json({
            error: "Invalid ObjectId",
            message: `The provided ID '${err.value}' for field '${err.path || '_id'}' is not a valid ObjectId.`,
            details: err.message
        });
    }


    // Handle Mongoose validation errors
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            error: "Validation error",
            details: Object.entries(err.errors).map(([field, error]) => ({
                field,
                message: error.message,
            })),
        });

    }

    // Handle Mongoose type errors
    // Can occur when trying to create a subdocument but the name (like 'animals') in the
    // Path is not well written.
    if (err instanceof TypeError) {
        return res.status(400).json({
            error: "TypeError",
            message: err.message,
            details: "A property was accessed on an undefined or null value.",
        });
    }

    // Handle Mongoose 409 errors (unique value already taken)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];

        return res.status(409).json({
            error: "Conflict",
            message: `The value '${value}' for '${field}' already exists.`,
            details: { field, value },
        });
    }



    // Handle other known errors with a status property
    if (err.status) {
        return res.status(err.status).json({
            error: err.message || "An error occurred",
            details: err.details || null,
        });
    }

    // Handle other unknown errors
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error" });
};