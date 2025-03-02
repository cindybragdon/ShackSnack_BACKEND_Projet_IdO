import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { createError } from '../utils/error.createError.js';

//Middleware pour authoriser le token ou le refuser
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const error = createError("Access token is missing.", 401);
    return next(error);
  }

  const token = authHeader.split(' ')[1];  // Extract the Bearer token

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;  // Attach the decoded user info to the request object
    next();  // Pass control to the next middleware or route handler
  } catch (error) {
    const errorInvalidToken = createError("Invalid or expired token.", 401);
    return next(errorInvalidToken);
  }
};

export default authenticateToken;