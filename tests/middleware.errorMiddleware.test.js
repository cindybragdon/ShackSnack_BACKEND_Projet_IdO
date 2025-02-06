import mongoose from "mongoose";
import { errorMiddleware } from "../src/middlewares/errorMiddleware";



const mockResponse = ()  => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};


describe('errorMiddleware', () => {



    test('should handle 401 Unauthorized error', () => {
        const error = { status: 401, message: 'Unauthorized access' };
        const res = mockResponse();

        errorMiddleware(error, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized access' });
    });


    test('should handle 401 Unauthorized error', () => {
        const error = { status: 401 };
        const res = mockResponse();

        errorMiddleware(error, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    test('should handle 403 Forbidden error', () => {
        const error = { status: 403 };
        const res = mockResponse();

        errorMiddleware(error, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });


    test('should handle 404 Not Found error', () => {
        const error = { status: 404 };
        const res = mockResponse();

        errorMiddleware(error, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Ressource not found' });
    });

    test('should handle Mongoose CastError', () => {
        const error = new mongoose.Error.CastError('ObjectId', 'invalid-id', '_id');
        const res = mockResponse();

        errorMiddleware(error, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid ObjectId',
            message: "The provided ID 'invalid-id' for field '_id' is not a valid ObjectId.",
            details: error.message
        });
    });


    test('should handle Mongoose CastError', () => {
        const error = new mongoose.Error.CastError('ObjectId', 'invalid-id');
        const res = mockResponse();

        errorMiddleware(error, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid ObjectId',
            message: "The provided ID 'invalid-id' for field '_id' is not a valid ObjectId.",
            details: error.message
        });
    });

    test('should handle Mongoose ValidationError', () => {
        const error = new mongoose.Error.ValidationError();
        error.errors = {
            name: { message: 'Name is required' },
            age: { message: 'Age must be a number' }
        };
        const res = mockResponse();

        errorMiddleware(error, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Validation error',
            details: [
                { field: 'name', message: 'Name is required' },
                { field: 'age', message: 'Age must be a number' }
            ]
        });
    });

    test('should handle TypeError', () => {
        const error = new TypeError('Cannot read property of undefined');
        const res = mockResponse();

        errorMiddleware(error, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'TypeError',
            message: 'Cannot read property of undefined',
            details: 'A property was accessed on an undefined or null value.'
        });
    });

    test('should handle unique value conflict error (code 11000)', () => {
        const error = {
            code: 11000,
            keyValue: { email: 'test@example.com' }
        };
        const res = mockResponse();

        errorMiddleware(error, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Conflict',
            message: "The value 'test@example.com' for 'email' already exists.",
            details: { field: 'email', value: 'test@example.com' }
        });
    });

    test('should handle unexpected errors', () => {
        const error = new Error();
        error.status = 451;
        const res = mockResponse();

        errorMiddleware(error, res);

        expect(res.status).toHaveBeenCalledWith(451);
        expect(res.json).toHaveBeenCalledWith({
            error: "An error occurred",
            details: null,
            error: "An error occurred",
        });
    });

    test('should handle other unknown errors', () => {
        const error = new Error('Unexpected error');
        const res = mockResponse();

        errorMiddleware(error, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});