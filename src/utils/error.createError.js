//Fonction pour créer une erreur et l'envoyer middleware d'erreur

export function createError(message, status) {

    const error = new Error(message);
    error.status = status;
    return error;
}