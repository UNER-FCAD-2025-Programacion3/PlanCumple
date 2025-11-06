import { body, validationResult } from 'express-validator';
import JSendResponse from '../utils/jsendResponse.js';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:mm

const formatJSendError = (errors) => {
    const validationErrors = {};
    errors.forEach(error => {
        validationErrors[error.path] = error.msg;
    });
    return JSendResponse.fail({ validation: validationErrors });
};

export const validarTurno = [
    body('orden')
        .isInt({ min: 1 })
        .withMessage('El orden debe ser un número entero mayor a 0'),

    body('hora_desde')
        .matches(timeRegex)
        .withMessage('hora_desde debe tener el formato HH:mm'),

    body('hora_hasta')
        .matches(timeRegex)
        .withMessage('hora_hasta debe tener el formato HH:mm'),

    // Middleware para manejar errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];
