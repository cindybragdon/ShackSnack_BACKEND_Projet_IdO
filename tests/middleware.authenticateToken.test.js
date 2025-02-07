import jwt from 'jsonwebtoken';
import { createError } from '../src/utils/error.createError';
import authenticateToken from '../src/middlewares/middleware.authenticateToken';

jest.mock('jsonwebtoken');
jest.mock('../src/utils/error.createError');

describe('authenticateToken middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = { headers: {} };
        mockRes = {};
        mockNext = jest.fn();
    });

    test('should return 401 if no authorization header is present', () => {
        // Mock createError to return an Error object
        createError.mockReturnValue(new Error('Access token is missing.'));

        authenticateToken(mockReq, mockRes, mockNext);

        expect(createError).toHaveBeenCalledWith('Access token is missing.', 401);
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));  // Should pass now
    });

    test('should return 401 if token is invalid', () => {
        mockReq.headers.authorization = 'Bearer invalidToken';
        createError.mockReturnValue(new Error('Invalid or expired token.'));
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        authenticateToken(mockReq, mockRes, mockNext);

        expect(jwt.verify).toHaveBeenCalledWith('invalidToken', expect.any(String));
        expect(createError).toHaveBeenCalledWith('Invalid or expired token.', 401);
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));  // Should pass now
    });

    test('should call next() if token is valid', () => {
        const decodedUser = { id: '12345', name: 'Test User' };
        mockReq.headers.authorization = 'Bearer validToken';
        jwt.verify.mockReturnValue(decodedUser);

        authenticateToken(mockReq, mockRes, mockNext);

        expect(jwt.verify).toHaveBeenCalledWith('validToken', expect.any(String));
        expect(mockReq.user).toEqual(decodedUser);
        expect(mockNext).toHaveBeenCalledWith();  // Should pass now
    });
});
