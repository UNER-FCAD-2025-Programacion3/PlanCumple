import { body, validationResult } from 'express-validator';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:mm

const formatJsonApiError = (errors) => ({
    errors: errors.map(error => ({
        status: "400",
        title: "Error de validación",
        detail: error.msg,
        source: { pointer: `/data/attributes/${error.path}` }
    }))
});

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
            return res.status(400).json(formatJsonApiError(errors.array()));
        }
        next();
    }
];
