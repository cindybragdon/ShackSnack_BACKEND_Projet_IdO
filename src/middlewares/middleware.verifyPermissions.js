import { createError } from "../utils/error.createError.js";


//Middleware qui vérifie si l'utilisateur est un admin.
//Si le ID du user dans les paramêtres ou le role 
//n'est pas le même que celui du user connecté,
//On refuse l'accès malveillant 
//(Permet de protéger d'un user qui veut se mettre admin
//Ou d'un user qui veut modifier un autre user)
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


//Middleware qui vérifie que seul un admin connecté peut acéder à cette route
export function verifyAdmin(req, res, next) {

    if(req.user.role !== 'Admin') {
        const error = createError("You are not permitted to access this information", 403);
        next(error);
    }

    next();
}

//Middleware qui restraint les users normaux et n'accepte pas que n'importe qui se crée
//Un compte admin
export function denyCreateAccountAdmin(req, res, next) {

    if(req.body.role === 'Admin') {
        const error = createError("You don't have the rights to do this", 403);
        next(error);
    }

    next();
}