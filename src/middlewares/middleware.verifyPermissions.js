import { createError } from "../utils/error.createError.js";

export function verifyPermissions(req, res, next) {

    if(req.params.id) {
        if(req.user.id !== req.params.id && req.user.role !== 'Admin') {
            const error = createError("You are not permitted to access this information", 403);
            next(error);
        }
    }

    if(req.body.role) {
        if(req.user.role !== 'Admin' && req.body.role === 'Admin') {
            const error = createError("You are not permitted to access this information", 403);
            next(error);
        }
    }
    next();

}

export function verifyAdmin(req, res, next) {

    if(req.user.role !== 'Admin') {
        const error = createError("You are not permitted to access this information", 403);
        next(error);
    }

    next();
}

export function denyCreateAccountAdmin(req, res, next) {

    if(req.body.role === 'Admin') {
        const error = createError("You don't have the rights to do this", 403);
        next(error);
    }

    next();
}