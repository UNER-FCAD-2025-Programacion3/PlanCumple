import { validationResult } from 'express-validator';
import JSendResponse from '../utils/jsendResponse.js';

// Helper para formatear errores de validación en formato JSend
export const formatJSendError = (errors) => {
    const formattedErrors = {};
    errors.forEach(error => {
        formattedErrors[error.path] = error.msg;
    });
    return formattedErrors;
};

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(JSendResponse.fail(formatJSendError(errors.array())));
    }
    next();
};